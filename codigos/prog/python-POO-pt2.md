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
print("Somente inteiros permitidos")
carteira = 0
class Conta:
  
  def __init__(self, saldoini = 0):
    self.__saldo = saldoini

  def depositar(self, valor):
    global carteira
    
    if valor <= 0:
      print("Valor inválido, tente novamente.")
    elif carteira < valor:
      print("Você não tem dinheiro suficiente, tente novamente.")
    else:
      self.__saldo += valor
      carteira -= valor
      print("Depositado", valor, "com sucesso, novo saldo", self.__saldo, "carteira", carteira)
      
  def sacar(self, valor):
    global carteira
    
    if valor <= 0:
      print("Valor inválido, tente novamente.")
    elif valor > self.__saldo:
      print("Você não tem dinheiro suficiente pra sacar este valor, tente novamente.")
    else:
      self.__saldo -= valor
      carteira += valor
      print("Você sacou", valor, "com sucesso, adicionado à carteira, novo saldo", self.__saldo, "carteira", carteira)
  
  def consultar(self):
    print("Atualmente no banco tem:", self.__saldo, "carteira:", carteira)

banco = Conta()
while True:
  print("[1] Depositar [2] Sacar [3] Consulta [4] Inserir Dinheiro")
  escolha = int(input("> "))
  match escolha:
    case 1:
      valor1 = int(input("Valor: "))
      banco.depositar(valor1)
      
    case 2:
      valor1 = int(input("Valor: "))
      banco.sacar(valor1)

    case 3:
      banco.consultar()

    case 4:
      valor1 = int(input("Valor: "))
      carteira += valor1

    case _:
      print("Inválido.")

```
**Ex. 3**

PYTHON
```python
class Animal:
  def som(self):
    print("*Barulhos de animal.")

class Gato(Animal):
  def som(self):
    print("Miau!")

class Cao(Animal):
  def som(self):
    print("Au Au!")

dogao = Cao()
gatao = Gato()

gatao.som()
dogao.som()

```

**Ex. 4**

PYTHON
```python
from abc import ABC, abstractmethod

class Forma(ABC):
    @abstractmethod
    def area(self):
        pass
      
class Retangulo(Forma):
  def __init__(self, largura, altura):
      self.largura = largura
      self.altura = altura

  def area(self):
    print("Area do retangulo:", self.largura * self.altura)

class Circulo(Forma):
  def __init__(self, raio):
    self.raio = raio

  def area(self):
    print("Area do circulo:", 3.14*(self.raio * self.raio))

circulo = Circulo(4)
retangulo = Retangulo(2,4)

retangulo.area()
circulo.area()

```

**Ex. 5**

PYTHON
```python
from abc import ABC, abstractmethod

class Pessoa(ABC):

    def __init__(self, nome, idade):
        self.__nome = nome
        self.__idade = idade

    def name(self):
        return self.__nome

    def age(self):
        return self.__idade

    @abstractmethod
    def falar(self):
        pass

class Aluno(Pessoa):

    def __init__(self, nome, idade, materia):
        super().__init__(nome, idade)
        self.materia = materia

    def falar(self):
        print(f"Olá, eu sou {self.name()}, tenho {self.age()} anos, atualmente estudo {self.materia}!!")

class Prof(Pessoa):

    def __init__(self, nome, idade, materia):
        super().__init__(nome, idade)
        self.materia = materia

    def falar(self):
        print(f"Oi, meu nome é {self.name()} e estou com {self.age()} anos, eu dou aulas sobre {self.materia}.")

prof1 = Prof("César", 35, "Programação")
aluno1 = Aluno("Bryan", 15, "Programação")

aluno1.falar()
prof1.falar()

```
