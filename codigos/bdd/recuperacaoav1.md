```MySQL
-- RECUPERAÇÃO: TRIGGERS, VIEWS E TRANSACTIONS

-- EXERCÍCIO 1: CRIAR AS TABELAS

CREATE TABLE produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    quantidade INT
);

CREATE TABLE historico_estoque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produto_id INT,
    quantidade_antiga INT,
    quantidade_nova INT,
    data_alteracao DATETIME
);


-- EXERCÍCIO 2: CRIAR A TRIGGER

DELIMITER //

CREATE TRIGGER registrar_alteracao_estoque
AFTER UPDATE ON produtos
FOR EACH ROW
BEGIN
    INSERT INTO historico_estoque (
        produto_id,
        quantidade_antiga,
        quantidade_nova,
        data_alteracao
    )
    VALUES (
        OLD.id,
        OLD.quantidade,
        NEW.quantidade,
        NOW()
    );
END //

DELIMITER ;


-- EXERCÍCIO 3: INSERIR PRODUTOS

INSERT INTO produtos (nome, quantidade)
VALUES
    ('Teclado', 10),
    ('Mouse', 20);


-- EXERCÍCIO 4: ALTERAR O ESTOQUE

-- Primeira alteração

UPDATE produtos
SET quantidade = 15
WHERE id = 1;

-- Segunda alteração

Realize a transferência utilizando uma Transação.

1. Inicie utilizando START TRANSACTION;
2. Retire R$ 300,00 da conta de Ana;
3. Adicione R$ 300,00 à conta de Carlos;
4. Consulte os saldos utilizando SELECT;
5. Confirme a transferência utilizando COMMIT;
6. Consulte novamente os saldos.

Depois, faça uma nova transferência de R$ 200,00 de Carlos para Ana, mas desta vez:

1. Inicie uma nova Transação;
2. Realize as alterações;
3. Consulte os saldos;
4. Execute ROLLBACK;
5. Consulte novamente os saldos;
Observe o que aconteceu com os valores.

-- EXERCÍCIO 5: CONSULTAR O HISTÓRICO


-- TRANSACTIONS

-- Criar a tabela contas

CREATE TABLE contas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titular VARCHAR(100),
    saldo DECIMAL(10,2)
);

-- Inserir as contas de Ana e Carlos

INSERT INTO contas (titular, saldo)
VALUES
    ('Ana', 1500.00),
    ('Carlos', 800.00);

-- Consultar os saldos iniciais

SELECT * FROM contas;


-- Transferência de R$ 300,00 de Ana para Carlos utilizando COMMIT

START TRANSACTION;

UPDATE contas
SET saldo = saldo - 300.00
WHERE titular = 'Ana';

UPDATE contas
SET saldo = saldo + 300.00
WHERE titular = 'Carlos';

-- Consultar os saldos antes de confirmar

SELECT * FROM contas;

-- Confirmar a transferência

COMMIT;

-- Consultar os saldos após o COMMIT

SELECT * FROM contas;


-- Transferência de R$ 200,00 de Carlos para Ana utilizando ROLLBACK

START TRANSACTION;

UPDATE contas
SET saldo = saldo - 200.00
WHERE titular = 'Carlos';

UPDATE contas
SET saldo = saldo + 200.00
WHERE titular = 'Ana';

-- Consultar os saldos antes de desfazer

SELECT * FROM contas;

-- Desfazer as alterações da transação

ROLLBACK;

-- Consultar os saldos após o ROLLBACK

SELECT * FROM contas;
```
SELECT * FROM historico_estoque;
```
