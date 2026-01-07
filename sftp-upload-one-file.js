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

        await sftp.put('dist/szuloi_ertekezlet_fogadoora/egyeni_fogadoorak_ps_bs.html', '/www/szuloi_ertekezlet_fogadoora/egyeni_fogadoorak_ps_bs.html')

        console.log('✅ Fájl sikeresen felülírva a szerveren')
    } catch (err) {
        console.error('❌ Hiba történt:', err.message)
    } finally {
        await sftp.end()
    }
}

main()
