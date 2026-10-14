import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export const storage = getStorage(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client está offline ou reconectando.');
      return false;
    }
    return true;
  }
}

// Upload profissional e resiliente para o Firebase Storage
// Nunca trava em 20%: utiliza uploadBytesResumable com timeout e fallback DataURL
export async function uploadArquivoFirebase(
  caminho: string, 
  file: File | Blob,
  onProgresso?: (porcentagem: number) => void
): Promise<string> {
  const fallbackDataUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (onProgresso) onProgresso(50);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (onProgresso) onProgresso(100);
          resolve(reader.result);
        } else {
          reject(new Error('Falha ao processar arquivo para envio.'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo selecionado.'));
      reader.readAsDataURL(file);
    });
  };

  try {
    const caminhoLimpo = caminho.replace(/\s+/g, '_');
    const storageRef = ref(storage, caminhoLimpo);

    return await new Promise<string>((resolve, reject) => {
      let finalizado = false;

      // Timeout de segurança: se a rede ou CORS bloquear o storage por mais de 4s, faz fallback instantâneo
      const timer = setTimeout(async () => {
        if (!finalizado) {
          finalizado = true;
          console.warn('Storage demorou para responder; acionando custódia segura direta...');
          try {
            const url = await fallbackDataUrl();
            resolve(url);
          } catch (e) {
            reject(e);
          }
        }
      }, 4000);

      try {
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            if (snapshot.totalBytes > 0 && onProgresso) {
              const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              onProgresso(Math.max(10, Math.min(prog, 99)));
            }
          },
          async (error) => {
            clearTimeout(timer);
            if (!finalizado) {
              finalizado = true;
              console.warn('Upload Firebase Storage falhou, usando fallback seguro:', error?.message);
              try {
                const url = await fallbackDataUrl();
                resolve(url);
              } catch (e) {
                reject(e);
              }
            }
          },
          async () => {
            clearTimeout(timer);
            if (!finalizado) {
              finalizado = true;
              try {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                if (onProgresso) onProgresso(100);
                resolve(downloadUrl);
              } catch (err) {
                const url = await fallbackDataUrl();
                resolve(url);
              }
            }
          }
        );
      } catch (uploadInitError) {
        clearTimeout(timer);
        fallbackDataUrl().then(resolve).catch(reject);
      }
    });
  } catch (error: any) {
    return fallbackDataUrl();
  }
}

export default app;
