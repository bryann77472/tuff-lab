# POO Parte 2, exercícios
## Exercícios
  1. Crie uma classe Pessoa com o atributo nome. Depois crie as classes Aluno e Professor, que devem herdar de Pessoa.

  2. Crie uma classe ContaBancaria com o saldo protegido. Implemente os métodos depositar(valor), sacar(valor) e consultarSaldo(), impedindo o acesso direto ao saldo.

  3. Crie uma classe Animal com o método emitirSom(). Depois crie as classes Cachorro e Gato, cada uma implementando o método de forma diferente.

  4. Crie uma classe abstrata Forma com o método calcularArea(). Depois crie as classes Retangulo e Circulo, cada uma implementando seu próprio cálculo de área.

  5. Desenvolva um pequeno sistema com as classes Pessoa, Aluno e Professor, aplicando:

- Herança (Aluno e Professor herdando de Pessoa);
- Encapsulamento (algum atributo privado/protegido com métodos de acesso);
- Polimorfismo (um método sobrescrito de forma diferente em Aluno e Professor);
- Abstração (uma classe abstrata ou interface definindo um contrato comum).
## Códigos

**Ex. 1**

PYTHON
```python
class Pessoa:
  def __init__(self, nome, idade):
    self.nome = nome
    self.idade = idade
class Aluno(Pessoa):
  def __init__(self, nome, idade, materia):
    super().__init__(nome, idade)
    self.materia = materia
class Professor(Pessoa):
  def __init__(self, nome, idade, materia):
    super().__init__(nome, idade)
    self.materia = materia

prof1 = Professor("César", 35, "Prog.")
aluno1 = Aluno("Renan", 15, "Prog.")
print("Professor e aluno:", prof1.nome, aluno1.nome)
```
**Ex. 2**

PYTHON
```python
class Produto:

    def __init__(self, nome, preco, estoque):
        self.nome = nome
        self.preco = preco
        self.estoque = estoque
      
Produto1 = Produto("Escova de dente", 3.50, 3)
print(f"Nome produto: {Produto1.nome}, Preço: {Produto1.preco}, Estoque: {Produto1.estoque}")

Produto2 = Produto("Pasta de dente", 6.50, 6)
print(f"Nome produto: {Produto2.nome}, Preço: {Produto2.preco}, Estoque: {Produto2.estoque}")

```
**Ex. 3**

PYTHON
```python
class Aluno:

    def __init__(self, nome, nota):
        self.nome = nome
        self.nota = nota
nomeA = input("Nome do aluno: ")
notaA = float(input("Nota do Aluno: "))
aluno1 = Aluno(nomeA, notaA)

print(f"O aluno(a) foi aprovado com {aluno1.nota}" if aluno1.nota >= 6 else f"O aluno(a) foi reprovado com {aluno1.nota}")

# Preferi não usar.
# print(f"Aprovado? {bool(aluno1.nota >=6)}")
```

**Ex. 4**

PYTHON
```python
class retangulo:

  def __init__(self, largura, altura):
        self.largura = largura
        self.altura = altura

  def calcular_perimetro(self):
        return  2 * (self.largura + self.altura)

larguraobj = float(input("Largura: "))
alturaobj = float(input("Altura: "))

retangulo = retangulo(larguraobj, alturaobj)
perimetro = retangulo.calcular_perimetro()

print(f"Largura: {retangulo.largura}, Altura: {retangulo.altura}, Perimetro: {perimetro}")

```

**Ex. 5**

PYTHON
```python
class conta_bancaria:
  def __init__(self, saldo):
    self.__saldo = saldo

  def depositar(self, valor):
    if valor > 0:
      self.__saldo += valor
      print(f"Depositado {valor} com sucesso.")
    else:
      print("Valor inválido")

  def consultar(self):
    return self.__saldo

conta = conta_bancaria(100)
deposito = float(input("Valor a depositar: "))
conta.depositar(deposito)

print(f"Valor da conta: {conta.consultar()}")
```
