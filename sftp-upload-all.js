import Client from 'ssh2-sftp-client';
import fs from 'fs';
import path from 'path';

const sftp = new Client();

// 🔧 SFTP kapcsolat adatok
const config = {
  host: 'sftp.edu.hu',
  port: 22,
  username: 'petofiszeged.edu.hu',
  password: 'sN7gkPF6HlOV'
};

// 🔧 Helyi és távoli alapmappa
const localBase = 'dist';
const remoteBase = '/www';

/**
 * Feltölt egy mappát rekurzívan — csak az újabb / módosított HTML fájlokat.
 */
async function uploadFolder(localDir, remoteDir) {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });

  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const remotePath = `${remoteDir}/${entry.name}`;

    // 🔹 Ha mappa
    if (entry.isDirectory()) {
      if (entry.name === 'assets') {
        console.log(`⏩ Kihagyva: ${localPath}`);
        continue;
      }
      await sftp.mkdir(remotePath, true).catch(() => {});
      await uploadFolder(localPath, remotePath);
    }

    // 🔹 Ha HTML fájl
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      const localStat = fs.statSync(localPath);

      // Megpróbáljuk lekérdezni a távoli fájlt (ha nem létezik, feltöltjük)
      const remoteInfo = await sftp.stat(remotePath).catch(() => null);

      const localTime = localStat.mtimeMs;
      const remoteTime = remoteInfo
        ? new Date(remoteInfo.modifyTime).getTime()
        : 0;
      const localSize = localStat.size;
      const remoteSize = remoteInfo ? remoteInfo.size : 0;

      // Feltöltés csak ha újabb vagy más méretű
      if (!remoteInfo || localSize !== remoteSize || localTime > remoteTime) {
        await sftp.fastPut(localPath, remotePath);
        console.log(`🔄 Frissítve: ${remotePath}`);
      } else {
        console.log(`⏩ Nem változott: ${remotePath}`);
      }
    }
  }
}

/**
 * Fő folyamat
 */
async function main() {
  try {
    console.log('🔌 Kapcsolódás a szerverhez...');
    await sftp.connect(config);

    console.log('📂 Rekurzív feltöltés indul...');
    await uploadFolder(localBase, remoteBase);

    console.log('🏁 Szinkronizálás kész, kapcsolat bontva.');
  } catch (err) {
    console.error('❌ Hiba történt:', err.message);
  } finally {
    await sftp.end();
  }
}

main();
