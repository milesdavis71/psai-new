import Client from 'ssh2-sftp-client'
const sftp = new Client()

async function main() {
    try {
        await sftp.connect({
            host: 'sftp.edu.hu',
            port: 22,
            username: 'petofiszeged.edu.hu',
            password: 'sN7gkPF6HlOV',
        })

        await sftp.put(
            'dist/galeriak/2025_26/ps/fooldal_ps.html',
            '/www/galeriak/2025_26/ps/fooldal_ps.html'
        )

        console.log('✅ Fájl sikeresen felülírva a szerveren')
    } catch (err) {
        console.error('❌ Hiba történt:', err.message)
    } finally {
        await sftp.end()
    }
}

main()
