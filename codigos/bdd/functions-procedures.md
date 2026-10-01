# Functions e Procedures, exercícios
## Exercícios
  **1. Crie uma Function chamada ```dobro``` que receba um número inteiro e retorne o dobro desse número.**

  **2. Crie uma Function chamada ```situacao_aluno``` que receba uma média e retorne:**

  - Aprovado para médias maiores ou iguais a 6;
  - Recuperação para médias maiores ou iguais a 4 e menores que 6;
  - Reprovado para médias menores que 4.

  **3. Crie uma Procedure chamada ```buscar_alunos_por_idade``` que receba uma idade mínima e liste todos os alunos que possuem idade maior ou igual ao valor informado.**

  **4. Crie uma Procedure chamada aumentar_nota que receba:**
     
  - O ID do aluno;
  - O valor do aumento.

  **5. Crie uma Function chamada calcular_media que receba duas notas e retorne a média.**

  Depois crie uma Procedure chamada mostrar_situacao que receba o ID de um aluno e apresente:

  - Nome;
  - Nota 1;
  - Nota 2;
  - Média;
  - Situação.
    
  A média deverá ser calculada utilizando a Function criada anteriormente.

## Códigos

**Ex. 1**

MySQL
```MySQL
delimiter $$ 

create function dobro(numero int)
returns int 
begin
return numero * 2; 
end $$ 
delimiter $$ 
select dobro(10)
```
**Ex. 2**

MySQL
```MySQL
delimiter $$


create function situacao_aluno( 
media decimal(5,2) 
) 
returns varchar(20) 
begin 
if media >= 6 then 
return 'aprovado'; 
elseif media >= 4 then 
return 'recuperação';
else 
return 'reprovado'; 
end if; 
end $$


delimiter ; 


select situacao_aluno(8);
```
**Ex. 3**

MySQL
```MySQL
create table aluno( 
nome varchar(20) not null, 
idade not null
); 


insert into aluno(nome, idade) values 
('laura da silva', 18), 
('tiago pereira', 18); 


delimiter $$ 


create procedure buscar_alunos_por_idade(in idade_minima int)
begin 
select * 
from alunos 
where idade >= idade_minima; 
end $$ 


delimiter ; 


call buscar_alunos_por_idade(18);
```

**Ex. 4**

MySQL
```MySQL
create table aluno ( 
id int auto_increment primary key, 
nome varchar(100) not null, 
nota decimal(4,2) default 0 
); 


insert into alunos (nome, nota) values
('sophia da rosa', 7.50),
('rodrigo da souza', 6),
('paulo gonçalvez', 8.25),
('yasmin lima', 5.50),
('joaquim da silva', 9),


 delimiter $$ 


create procedure aumentar_nota(
in p_aluno_id int, 
in p_aumento decimal(4,2)
)
begin 
update alunos 
set nota = nota + p_aumento 
where id = p_aluno_id; 
end$$ 


delimiter ;
```

**Ex. 5**

MySQL
```MySQL
create table aluno ( 
id int primary key auto_increment, 
nome varchar(100) not null, 
nota1 decimal(5,2), 
nota2 decimal(5,2) 


);


insert into aluno (nome, nota1, nota2) values
('joão', 8.0, 7.0), 
('laura', 9.0, 8.0), 
('rodrigo', 5.0, 4.0), 
('sophia', 3.0, 2.0),
('carlos', 6.0, 7.0); 


delimiter $$ 


create function calcular_media( 
nota1 decimal(5,2), 
nota2 decimal(5,2) 
) 
returns decimal(5,2)
begin return (nota1 + nota2) / 2; 
end $$ 


delimiter ; 


delimiter $$ 



create procedure mostrar_situacao(in id_aluno int) 
begin 
select 
nome, 
nota1, 
nota2, 
calcular_media(nota1, nota2) as media, 
case 
when calcular_media(nota1, nota2) >= 6 then 'aprovado' 
when calcular_media(nota1, nota2) >= 4 then 'recuperação' 
else 'reprovado' 
   end as situacao 
from aluno 
where id = id_aluno; 
end $$ 


delimiter ; call mostrar_situacao(5); 


select * from aluno
```
