
  def __init__(self, nome, idade):
    self.nome = nome
    self.idade = idade

pessoa1 = pessoa("Rogério", 55)
print(f"Pessoa: {pessoa1.nome}, idade: {pessoa1.idade}")
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
