# POO Parte 1, exercícios
## Exercícios
  1. Classe e Objeto Crie uma classe Pessoa com os atributos nome e idade. Crie um objeto e exiba seus atributos.

  2. Construtor Crie uma classe Produto com os atributos nome, preco e estoque, inicializados por um construtor. Crie dois produtos diferentes e exiba seus dados.

  3. Métodos Crie uma classe Aluno com os atributos nome e nota. Implemente o método aprovado(), que deve retornar true quando a nota for maior ou igual a 6.

  4. this / self Crie uma classe Retangulo com os atributos largura e altura. Utilize this (ou self) para inicializá-los no construtor e implemente um método calcularPerimetro().

  5. Modificadores de acesso Crie uma classe ContaBancaria com o atributo saldo como privado. Implemente os métodos depositar(valor) e consultarSaldo(), sem permitir que o saldo seja alterado diretamente.

## Códigos

**Ex. 1**
PYTHON
```
class pessoa:
  
  def __init__(self, nome, idade):
    self.nome = nome
    self.idade = idade

pessoa1 = pessoa("Rogério", 55)
print(f"Pessoa: {pessoa1.nome}, idade: {pessoa1.idade}")
```
