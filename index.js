const readline = require('readline');
const oracledb = require('oracledb');

async function createConnection() {
    try {
        const connection = await oracledb.getConnection({
            user: '',
            password: '',
            connectionString: ''
        });
        return connection;
    } catch (err) {
        console.error('Erro ao estabelecer conexão com o banco de dados Oracle: ', err);
    }
}

async function insertData(connection, name) {
    try {
        const result = await connection.execute(`INSERT INTO pessoa (nome) VALUES (:1)`, [name]);
        connection.commit()
        console.log(result.rowsAffected, 'Registro inserido');
    } catch (err) {
        console.error('Erro ao inserir dados na tabela pessoa: ', err);
    }
}

async function deleteData(connection, id) {
    try {
        const result = await connection.execute(`DELETE FROM pessoa WHERE id = :1`, [id]);
        connection.commit()
        console.log(result.rowsAffected, 'Registro excluído');
    } catch (err) {
        console.error('Erro ao excluir dados na tabela pessoa: ', err);
    }
}

async function listData(connection) {
    try {
        const result = await connection.execute(`SELECT * FROM pessoa`, [], { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });
        const rs = result.resultSet; let row;
        while ((row = await rs.getRow())) {
            console.log(row);
        }
        await rs.close();
    } catch (err) {
        console.error('Erro ao listar dados na tabela pessoa: ', err);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    const connection = await createConnection();
    rl.question('Digite a opção (adicionar, listar ou excluir): ', async (option) => {
        if (option === 'adicionar') {
            rl.question('Digite o nome: ', async (name) => {
                await insertData(connection, name);
                main();
            });
        }
        else if (option === 'listar') {
            await listData(connection);
            main();
        }
        else if (option === 'excluir') {
            rl.question('Digite o ID da pessoa a ser excluída: ', async (id) => {
                await deleteData(connection, id);
                main();
            });
        }
    });
}

main();