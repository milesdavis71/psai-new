import Client from 'ssh2-sftp-client'
const sftp = new Client()

async function main() {
    try {
        await sftp.connect({
            host: 'sftp.edu.hu',
            port: 22,
            username: 'petofiszeged.edu.hu',
            password: 'aflcabpZDp8V',
        })

        await sftp.put(
            'dist/bemutatkozas/iskolankat_segito_kulsos_munkatarsak.html',
            '/www/bemutatkozas/iskolankat_segito_kulsos_munkatarsak.html'
        )

        console.log('✅ Fájl sikeresen felülírva a szerveren')
    } catch (err) {
        console.error('❌ Hiba történt:', err.message)
    } finally {
        await sftp.end()
    }
}

main()
