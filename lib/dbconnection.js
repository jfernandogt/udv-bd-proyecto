// get the client
import mysql from 'mysql2/promise'

let dbConnection
export default async function connection() {
  try {
    // if (!dbConnection) {
    // dbConnection = await mysql.createConnection({
    //   host: '188.166.163.192',
    //   user: 'appudv',
    //   database: 'udv_v3',
    //   password: '05535dca9e65d1ff70c73c7653c270756ea5fc4c020f2b09',
    //   port: 3306,
    // })

    const pool = mysql.createPool({
      host: '188.166.163.192',
      user: 'appudv',
      database: 'udv_v3',
      password: '05535dca9e65d1ff70c73c7653c270756ea5fc4c020f2b09',
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
      idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
      queueLimit: 0,
      port: 3306,
    })
    // }

    return pool
  } catch (e) {
    console.log('error', e.message)
  }
}
