import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { auth } from './firebase';

// Cache em memória do access token OAuth2 (NÃO armazenar em localStorage)
let cachedAccessToken: string | null = null;
let cachedGoogleUser: User | null = null;

const GOOGLE_DRIVE_FOLDER_NAME = 'Backups Gaditas';
const SCOPE_DRIVE_FILE = 'https://www.googleapis.com/auth/drive.file';

export interface GoogleDriveBackupFile {
  id: string;
  name: string;
  size?: string;
  createdTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

/**
 * Autentica o usuário no Google com o escopo de arquivos do Google Drive
 * e armazena o access token estritamente em memória.
 */
export async function autenticarGoogleDrive(forcePrompt = false): Promise<{ accessToken: string; user: User }> {
  if (cachedAccessToken && cachedGoogleUser && !forcePrompt) {
    return { accessToken: cachedAccessToken, user: cachedGoogleUser };
  }

  const provider = new GoogleAuthProvider();
  provider.addScope(SCOPE_DRIVE_FILE);
  if (forcePrompt) {
    provider.setCustomParameters({ prompt: 'select_account' });
  }

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);

  if (!credential?.accessToken) {
    throw new Error('Falha ao obter token de acesso do Google Drive. Verifique a autenticação.');
  }

  cachedAccessToken = credential.accessToken;
  cachedGoogleUser = result.user;

  return { accessToken: cachedAccessToken, user: cachedGoogleUser };
}

/**
 * Retorna o token em memória se já estiver autenticado
 */
export function getCachedGoogleDriveToken(): string | null {
  return cachedAccessToken;
}

/**
 * Retorna o usuário Google conectado em memória
 */
export function getCachedGoogleUser(): User | null {
  return cachedGoogleUser;
}

/**
 * Desconecta a sessão do Google Drive em memória
 */
export function desconectarGoogleDrive(): void {
  cachedAccessToken = null;
  cachedGoogleUser = null;
}

/**
 * Localiza a pasta "Backups Gaditas" no Google Drive do usuário ou a cria automaticamente se não existir
 */
export async function obterOuCriarPastaBackups(accessToken: string): Promise<string> {
  // 1. Pesquisa se a pasta já existe e não está na lixeira
  const query = encodeURIComponent(`name='${GOOGLE_DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&spaces=drive`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!searchRes.ok) {
    const errorText = await searchRes.text();
    throw new Error(`Erro ao consultar pastas no Google Drive (${searchRes.status}): ${errorText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // 2. Se não existir, cria a pasta "Backups Gaditas"
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: GOOGLE_DRIVE_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Pasta oficial de backups automáticos da Equipe Gaditas',
    }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Erro ao criar pasta no Google Drive (${createRes.status}): ${errorText}`);
  }

  const folderData = await createRes.json();
  return folderData.id;
}

/**
 * Faz upload multipart de um arquivo JSON para a pasta de backups no Google Drive
 */
export async function salvarArquivoNoGoogleDrive(
  accessToken: string,
  nomeArquivo: string,
  conteudoJson: string
): Promise<{ fileId: string; nome: string; webViewLink?: string; createdTime?: string; size?: string }> {
  // 1. Garante que a pasta existe e obtém seu ID
  const pastaId = await obterOuCriarPastaBackups(accessToken);

  // 2. Monta o corpo multipart/related
  const boundary = '-------GaditasDriveBackup' + Date.now();
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: nomeArquivo,
    mimeType: 'application/json',
    parents: [pastaId],
    description: `Backup completo do sistema Equipe Gaditas gerado em ${new Date().toLocaleString('pt-BR')}`,
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    conteudoJson +
    closeDelimiter;

  const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,size,createdTime';

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Falha no upload para o Google Drive (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    fileId: data.id,
    nome: data.name,
    webViewLink: data.webViewLink,
    createdTime: data.createdTime,
    size: data.size,
  };
}

/**
 * Lista os arquivos de backup salvos na pasta "Backups Gaditas"
 */
export async function listarBackupsGoogleDrive(accessToken: string): Promise<GoogleDriveBackupFile[]> {
  try {
    const pastaId = await obterOuCriarPastaBackups(accessToken);
    const query = encodeURIComponent(`'${pastaId}' in parents and trashed=false`);
    const listUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,size,createdTime,webViewLink,iconLink)&orderBy=createdTime desc&pageSize=30`;

    const res = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.warn('Erro ao listar arquivos do Google Drive:', err);
    return [];
  }
}
