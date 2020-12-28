# Documentação Técnica TPO

Este material aqui registrado tem por objetivo descrever tecnicamente os principais aspectos da implementação, ambiente e deploy do sistema TPO.

1. [Ambiente](#ambiente)
2. [Arquitetura da Aplicação](#arquitetura-da-aplicação)
3. [Requisitos para Desenvolvimento](#requisitos-para-desenvolvimento)
4. [Execução em Ambiente Local](#execução-em-ambiente-local)
5. [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
6. [Deployment Produção](#deployment-produção)
7. [Deployment QA](#deployment-qa)
8. [Containers](#containers)
9. [Entidades MongoDB](#entidades-mongodb)
10. [Processos BATCH](#processos-batch)
11. [Principais Verificações MongoDB](#principais-verificações-mongodb)
12. [Testando APIs](#testando-apis)


## Ambiente

### Ambiente de QA
Para o ambiente de QA, temos:
- Uma máquina para o MongoDB + BackEnd + FrontEnd

![Ambiente de QA](documentation/ambienteQA.png)

### Ambiente de Produção
Para o ambiente de Produção, temos:
- Uma máquina para o MongoDB
- Uma máquina para o BackEnd
- Uma máquina para o FrontEnd

![Ambiente de Produção](documentation/ambientePROD.png)

## Arquitetura da Aplicação
A aplicação é basicamente composta por alguns componentes, que são:
- Um **FrontEnd TPO**.
- Um **Gateway TPO** que INTERMEDIA a comunicação entre o FrontEnd e o BackEnd.
- Uma série de Endpoints que compõem o **BackEnd TPO**
- Um **Banco de Dados MongoDB**, que armazena informações OU pertinentes ao TPO, OU complementares ao TMS.
- Um Endpoint que consulta/armazena informações no TMS, que aqui chamamos de **HUB TMS**

![Arquitetura](documentation/arquiteturaTPO.png)

Seguem as descrições principais de cada um destes componentes.

#### HUB TMS
Para construção do HUB TMS, foi construído um BackEnd em NodeJS, que faz acesso ao banco de dados do TMS.
Para este início de construção do TPO, o TMS de referência foi o Visual Rodopar que armazena suas informações num banco de dados SQL Server.

Hoje, tanto o deploy do *HUB TMS*, quanto o deploy do *BackEnd TPO*, são realizados no mesmo servidor.

Isto é uma implicação natural por se tratar do primeiro HUB de TMS do TPO.

Entretanto não há necessidade que seja assim. Muito pelo contrário.

A estrutura criada pressupõe que futuramente outros TMS poderão se integrar ao TPO, e para tal será necessário "meramente" que seja construída uma API Rest que retorne os mesmos endpoints que hoje foram criados para o HUB TMS do Rodopar.

Estes outros TMSs, podem ser de outras tecnologias, e até mesmo guardar suas informações em outros bancos de dados que não o SQL Server.

Em se construíndo uma API Rest para este TMS, ele deve retornar as mesmas informações (Filiais, Motoristas, Veículos, Pedidos, etc...) que hoje o HUB do Rodopar retorna. 

#### MongoDB
Para o armazenando de dados do TPO foi utilizado o MongoDB.

O MongoDB é um banco de dados noSQL (No-Only SQL) que armazena os dados por meio de Documents.

No caso do MongoDB, o formato usado para armazenamento é JSON (JavaScript Object Notation)

É uma forma bem prática se aliada com o Framework de construção do BackEnd (NodeJS + Express), que será detalhado a seguir.

Entre os N tipos de banco de dados noSQL, também é o mais indicado, pois as informações nele armazendas são:
- Entidades relativamente simples (como por exemplo, tipos de ocorrência ou polígonos)
- Informações complementares ao TMS (como por exemplo, motoristas e veículos)
- Logs e registros históricos (como por exemplo, chamados do rastreador e API Google)
- Informações que precisam de cálculos com GEO Posicionamento (como por exemplo, polígonos e mapas sinóticos) *O MongoDB possui funções embutidas de GEO*
- Permite escalonamento horizontal

#### BackEnd TPO
Como já citado anteriormente, para o BackEnd foram usadas principalmente o NodeJS e o Express para construção dos endpoints das APIs Rest.

Em vez de um único Endpoint de BackEnd, foram construídos vários Endpoints.

Isto cria uma "dificuldade" de Deployment, uma vez que várias aplicações precisam ser mantidas, mas em contra-partidade cria uma facilidade de escalonamento (quando necessário), somente dos Endpoints que assim forem necessários.

Ao total são 15 Endpoints, que resultam em 15 aplicações.

Apenas como ilustração, imagine que alguns destes Endpoints sejam:
- Motoristas
- Veículos
- Usuários/Perfis
- Dashboards
- Parceiros Comerciais

Agora imagine que todos os Endpoints oferecem um tempo de resposta satisfatório em suas consultas e acessos, entretanto o Endpoint de Veículos, é largamente utilizado e sugere que ele precisa de mais recursos que outros endpoints, pois faz consultas e acessos mais complexos, ou até mesmo em volume muito maior que os demais.

Caso fosse apenas UMA APLICAÇÃO, ela inteiramente deveria ser escalonada, provavelmente implicando em custo mais alto. Entretanto este acréscimo de infra-estrutura seria "levado" a todos os módulos da aplicação, sem uma necessidade efetiva.

Entretanto, da forma como foi construído o BackEnd, é possível escalonar SOMENTE A APLICAÇÃO DESEJADA, nesse caso a de Veículos. As demais podem ficar como estão. Isto provavelmente implicará em um escalonamento mais preciso, e certamente menos custoso.

A estrutura toda foi elaborada para:
- Separação de módulos em múltiplos endpoints/aplicações
- Utilização de tecnologia de BackEnd que favorece a execução em multi-task (NodeJS)
- Utilização de banco de dados que permite o escolamento horizontal
- Deployment das aplicações em containers Docker (será exposto mais adiante)

Porém, ainda um elemento de infra-estrutura precisaria ser contemplado para que escalonamento ocorra de forma mais gerencial e natural.
Seria um gerenciador de container, como o Kubernetes por exemplo. Ele não é o único, mas é um dos mais conhecidos.

Este elemento não foi considerado nesta ambientação inicial.

Também é importante destacar que este é um elemento que questão estrutural, e não impacta em nada a construção da aplicação, com ele, ou sem ele. Ou seja, quando for necessário adicionar tal elemento no ambiente, não há impacto algum em codificação ou algo do tipo.

#### Gateway TPO
O Gateway também é uma construção em NodeJS que permite que o FrontEnd tenha uma acesso mais centralizado ao BackEnd.

Como citado anteriomente, o BackEnd foi "quebrado" em várias aplicações.

Cada uma delas responde num Endpoint Específico.

Ou seja, o FrontEnd, precisaria ter conhecimentos de todos os Endpoints de todos os BackEnds.

Isto, por vezes, se mostra complicado à medida que novos endpoints surgem.

Para que o FrontEnd tenha uma visão mais centralizada do BackEnd, foi criado o Gateway.

Ele meramente intermedia o FrontEnd com o BackEnd.

#### FrontEnd TPO
E por fim, o FrontEnd. Ele foi construído em Angular, com Bootstrap/Material como Framework de CSS.

## Requisitos para Desenvolvimento

É necessário que você tenha o GIT instalado

[Download GIT](https://git-scm.com/downloads)

É necessário que você tenha o NodeJS instalado (Window ou Linux, tanto faz)

[Download NodeJS](https://nodejs.org/en/download/)

Recomendamos que você utilize o Visual Studio Code como editor dos códigos-fonte (Novamente Window ou Linux, tanto faz)

[Download Visual Studio Code](https://code.visualstudio.com/download)

Como são várias aplicações, você precisará de vários terminais rodando ao mesmo tempo.

Sugerimos alguma aplicação de múltiplas janelas para terminais como o ConEmu ou CIGWYN (para Windows), e Terminator ou TMUX (para Linux). Qualquer uma é válida.

Quando em desenvolvimento, você poderá optar por usar um MongoDB Local, ou até mesmo o MongoDB de QA (a depender da implementação a ser desenvolvida). Sugerimos que sempre em Desenvolvimento seja usado um MongoDB Local.

Para instalação do MongoDB no Window

[Install MongoDB Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

Para instalação do MongoDB no Linux

[Install MongoDB Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

Recomendamos que seja instalado alguns software Client de MongoDB, como por exemplo o Mongo Compass ou noSQLBooster. Ambos tem versões para Windows e Linux.


## Execução em Ambiente Local

Em termos de repositórios de GIT, a organização ficou assim:
- Um Repositório para o FrontEnd TPO
- Um Repositório para o BackEnd TPO, Gateway TPO e HUB TMS

Futuramente, quando houver um novo HUB TMS, em função de nova integração com outro TMS que não o Rodopar, sugerimos:
- Um Repositório para o FrontEnd TPO **(Manter como está hoje)**
- Um Repositório para o BackEnd TPO e Gateway TPO **(Remover o HUB TMS)**
- Um NOVO Repositório para o HUB TMS Rodopar **(Transferir o HUB TMS)**
- Um NOVO Repositório para o NOVO HUB TMS que será criado

A considerar a estrutura atual, em há 2 Repositórios, serão necessárias as seguintes etapas para execução da aplicação em Ambiente Local.

### Etapa 1 - Clonar os 2 Repositórios

Sugerimos criar uma pasta local `C:\ghr-tpo`

No terminal (Linux ou Windows, já dentro desta pasta, executar os seguintes comandos):

`git clone https://github.com/grupo-mirassol/tpo-frontend.git`

`git clone https://github.com/grupo-mirassol/tpo-backend.git`

Após a execução destes dois comandos, duas pastas novas foram criadas. Uma para o FrontEnd, e outra para o BackEnd (BackEnd TPO, Gateway TPO e HUM TMS)

* **FrontEnd**

> > `C:\ghr-tpo\tpo-frontend`

* **BackEnd**

> > `C:\ghr-tpo\tpo-backend`

### Etapa 2 - Instalar Dependências

Tanto para o FrontEnd, quanto para o BackEnd, as dependências NPM deverão ser instaladas.

#### *Vamos começar pelo FrontEnd.*

Acesse a pasta no terminal de comandos:

`C:\ghr-tpo\tpo-frontend`

Digite o seguinte comando e ENTER:

`npm install`

#### *Agora vamos ao HUB TMS.*

Acesse a pasta no terminal de comandos:

`C:\ghr-tpo\tpo-backend\hub-tms\rodopar`

Digite o seguinte comando e ENTER:

`npm install`

#### *E por fim, vamos ao BackEnd TPO e Gateway TPO (Eles estão juntos).*

Acesse a pasta no terminal de comandos:

`C:\ghr-tpo\tpo-backend\api\torre`

Digite o seguinte comando e ENTER:

`npm install`

### Etapa 3 - Configurar Acesso do HUB TMS Rodopar

Como já citado anteriormente, hoje o único HUB TMS existente é o HUB do Rodopar.

Antes de rodar a aplicação, será necessário conferir em qual banco de dados do Rodopar se deseja conectar.

Para isto, acesso o arquivo .ENV, que está dentro do HUB TMS.

`C:\ghr-tpo\tpo-backend\hub-tms\rodopar\.env`

Lá você encontrará as seguintes configurações:

```
DB_PORT=porta_conexao_sql_rodopar
DB_USERNAME=usuario_sql_rodopar
DB_DATABASE=database_rodopar
DB_PASSWORD=senha_sql_rodopar
DB_HOST=servidor_rodopar
```

As configurações devem ser ajustadas para o SQL Server que se deseja conectar.

Também repare em outra configuração no mesmo arquivo

```
PORT=7090
```

Ela indica em que porta HTTP o HUB TMS estará respondendo. Caso deseje, você poderá mudar a porta.

### Etapa 4 - Subindo o HUB TMS

Feitos os ajustes necessários, é hora de rodar o HUB TMS.

Rodar o HUB TMS (e os demais BackEnds e FrontEnd) nada mais é do que subir uma aplicação NPM num terminal.

Vá até o diretório:
```
C:\ghr-tpo\tpo-backend\hub-tms\rodopar\
```

E inicie a aplicação:
```
npm start
```

Pronto! HUB TMS está respondendo.

### Etapa 5 - Configurar Acesso do BackEnd TPO

Antes de rodar a aplicação do BackEnd TPO e Gateway TPO (eles rodam juntos), será necessário conferir em qual banco de dados do MongoDB se deseja conectar.

Para isto, acesso o arquivo .ENV, que está dentro do BackEnd.

`C:\ghr-tpo\tpo-backend\api\torre\.env`

Lá você encontrará as seguintes configurações:

```
DB_DATABASE_TORRE=string_conexao_mongodb
```

As configurações devem ser ajustadas para o MongoDB que se deseja conectar.

Também repare em outra configuração no mesmo arquivo

```
HUB_TMS_PORT = 7090
```

Ela indica em que porta HTTP o HUB TMS estará respondendo. Caso você tenha alterado a porta de resposta do HUB TMS na Etapa 3, você deverá mudar a porta aqui também.

### Etapa 6 - Subindo o BackEnd TPO (+ Gateway TPO)

Feitos os ajustes necessários, é hora de rodar o BackEnd TPO.

Vá até o diretório:
```
C:\ghr-tpo\tpo-backend\api\torre\
```

E inicie a aplicação:
```
npm start
```

Pronto! BackEnd TPO está respondendo.

### Etapa 7 - Configurar Acesso do FrontEnd TPO

Antes de rodar a aplicação do FrontEnd TPO, será necessário conferir em qual API do BackEnd se deseja conectar.

Para isto, acesso o arquivo do Environment, que está dentro do FrontEnd.

`C:\ghr-tpo\tpo-frontend\src\environments\environment.ts`

Lá você encontrará as seguintes configurações:

```
export const environment = {
    production: false,
    endpoint: 'http://localhost:3000/api',
    qa: true
};
```

Repare que a API do BackEnd utilizada é `localhost:3000`

Caso seja necessário direcionar o teste LOCAL para a API do QA, não há problemas, somente será necessário apontar para o HOST:PORTA da API BackEnd do QA.

### Etapa 8 - Subindo o FrontEnd TPO

Feitos os ajustes necessários, é hora de rodar o FrontEnd TPO.

Vá até o diretório:
```
C:\ghr-tpo\tpo-frontend\
```

E inicie a aplicação:
```
npm start
```

Pronto! FrontEnd TPO está respondendo. Para acessá-lo no navegador:

[http://localhost:4200/](http://localhost:4200/)

## Fluxo de Desenvolvimento

Tanto para o FrontEnd, quanto para o BackEnd, recomendamos o seguinte fluxo de trabalho:

1. Atualizar a Branch master localmente
```
git checkout master
git pull
```

2. Criar Branch a partir da `master` para Desenvolvimento do que se pretende
```
git checkout -b nome-da-branch
```

3. Efetivar Branch Localmente
```
git add .
git commit -m "mensagem-da-manutencao"
```

4. Atualizar Branch com a `master`
```
git pull origin master
```

5. Efetivar Branch Remotamente
```
git push origin nome-da-branch
```

6. Abrir PULL REQUEST no GitHub direcionando para a `master` (estamos considerando o uso do GitHub)
7. Revisar PULL REQUEST no GitHub
8. Mergear PULL REQUEST
9. Remover Branch (ela já não é mais necessária)
10. Publicar `master` (seja Front ou Back) no ambiente de QA (ver mais à frente)
11. Validar ajuste no Ambiente QA
12. Publicar `master` (seja Front ou Back) no ambiente de Produção (ver mais à frente)
13. Validar ajuste no Ambiente Produção


## Deployment Produção

Para que os deploys ocorram de forma mais ágil e organizada, foi usado o Jenkins como ferramenta de automação de tarefas e tasks de deployment.

Para acessar o Jenkins de Produção, é necessário que a sua estação esteja conectada à VPN do Data Center, pois o acesso é pelo IP Local (e não pelo IP Público) do servidor.

Em Produção, como há um servidor para o FrontEnd, e outro servidor para o BackEnd, consequentemente há duas URLs do Jenkins para acesso.

**Jenkins Produção BackEnd TPO**

[http://192.168.100.8:8080/](http://192.168.100.8:8080/)

**Jenkins Produção FrontEnd TPO**

[http://192.168.100.9:8080/](http://192.168.100.9:8080/)

Ao acessar o Jenkins, ele solicitará usuário/senha de acesso.

Para ambos os Jenkins, usamos o mesmo usuário/senha.

Usuário: **admin-mirassol**

Senha: **mirassol123***

Recomendamos que futuramente estes dados de acesso, sejam alterados. Usamos estes dados "mais simples" apenas para implantação do projeto. Tão logo a implantação seja concluída, deve ser gerada uma senha mais forte.

### Como realizar um Deploy de Endpoint do BackEnd

Imagine que foi necessário um ajuste no módulo de Motoristas e tal ajuste foi realizado seguindo todos os procedimentos de GIT e o ajuste já está na branch **master**.

Como já citado anteriormente, há 15 aplicações (endpoints) distintos no BackEnd.

> *Em realidade há mais algumas aplicações que serão detalhadas mais à frente, que são os Jobs de execução BATCH.*

No exemplo que temos, somente será necessário realizar o Deploy da aplicação de Motoristas.

Para isto, serão necessários alguns passos.

Acesse o Jenkins do BackEnd TPO ([http://192.168.100.8:8080/](http://192.168.100.8:8080/)), e logo de início você verá os Jobs Jenkins disponíveis para deploy.

![Jobs Jenkins BackEnd TPO](documentation/job_jenkins_backend.png)


Acesso o JOB **prod-torre-api-servicos**

Ao lado esquerdo, haverá uma opção chamada **Construir com Parâmetros**. Acesse esta opção.

Na tela que será aberta, você deverá escolher a aplicação que precisa do Deploy. Neste caso **motorista**

Na caixa de texto "branch" deve ser mantida a opção **master**.

![Construir com Parâmetros](documentation/job_jenkins_backend_deploy.png)


Clique no botão **Construir** e o Deploy será iniciado.

Você poderá acompanhar a evolução dos Steps do Job de forma real-time, e tão logo ele seja finalizado, o deploy já estará feito.

Durante o processo de Deploy pode haver instabilidade na aplicação final (FrontEnd)

### Como realizar um Deploy do Gateway

Imagine que foi necessário um ajuste no Gateway e tal ajuste foi realizado seguindo todos os procedimentos de GIT e o ajuste já está na branch **master**.

> *Um exemplo de ajuste no Gateway, seria por exemplo a implementação de um novo endpoint*

Para realizar o Deploy do Gateway, serão necessários alguns passos.

Acesse o Jenkins do BackEnd TPO ([http://192.168.100.8:8080/](http://192.168.100.8:8080/)), e logo de início você verá os Jobs Jenkins disponíveis para deploy.

![Jobs Jenkins BackEnd TPO](documentation/job_jenkins_backend.png)


Acesso o JOB **prod-torre-gateway-servicos**

Ao lado esquerdo, haverá uma opção chamada **Construir com Parâmetros**. Acesse esta opção.

Na tela que será aberta, na caixa de texto "branch" deve ser mantida a opção **master**.

![Construir com Parâmetros](documentation/job_jenkins_gateway_deploy.png)


Clique no botão **Construir** e o Deploy será iniciado.

Você poderá acompanhar a evolução dos Steps do Job de forma real-time, e tão logo ele seja finalizado, o deploy já estará feito.

Durante o processo de Deploy pode haver instabilidade na aplicação final (FrontEnd)


### Como realizar um Deploy do HUB TMS

Imagine que foi necessário um ajuste no HUB TMS e tal ajuste foi realizado seguindo todos os procedimentos de GIT e o ajuste já está na branch **master**.

Para realizar o Deploy do HUB TMS, serão necessários alguns passos.

Acesse o Jenkins do BackEnd TPO ([http://192.168.100.8:8080/](http://192.168.100.8:8080/)), e logo de início você verá os Jobs Jenkins disponíveis para deploy.

![Jobs Jenkins BackEnd TPO](documentation/job_jenkins_backend.png)


Acesso o JOB **prod-torre-hub-servicos**

Ao lado esquerdo, haverá uma opção chamada **Construir com Parâmetros**. Acesse esta opção.

Na tela que será aberta, na caixa de texto "branch" deve ser mantida a opção **master**.

![Construir com Parâmetros](documentation/job_jenkins_hubtms_deploy.png)


Clique no botão **Construir** e o Deploy será iniciado.

Você poderá acompanhar a evolução dos Steps do Job de forma real-time, e tão logo ele seja finalizado, o deploy já estará feito.

Durante o processo de Deploy pode haver instabilidade na aplicação final (FrontEnd)


### Como realizar um Deploy do FrontEnd

Imagine que foi necessário um ajuste no FrontEnd e tal ajuste foi realizado seguindo todos os procedimentos de GIT e o ajuste já está na branch **master**.

Para realizar o Deploy do FrontEnd, serão necessários alguns passos.

Acesse o Jenkins do FrontEnd TPO ([http://192.168.100.9:8080/](http://192.168.100.9:8080/)), e logo de início você verá os Jobs Jenkins disponíveis para deploy.

![Jobs Jenkins FrontEnd TPO](documentation/job_jenkins_frontend.png)


Acesso o JOB **prod-torre-front**

Ao lado esquerdo, haverá uma opção chamada **Construir com Parâmetros**. Acesse esta opção.

Na tela que será aberta, na caixa de texto "branch" deve ser mantida a opção **master**.

![Construir com Parâmetros](documentation/job_jenkins_frontend_deploy.png)


Clique no botão **Construir** e o Deploy será iniciado.

Você poderá acompanhar a evolução dos Steps do Job de forma real-time, e tão logo ele seja finalizado, o deploy já estará feito.

Durante o processo de Deploy pode haver instabilidade na aplicação final (FrontEnd)



## Deployment QA

Para Deploy no ambiente de QA, seguir os mesmos procedimentos do ambiente de Produção, considerando as seguintes URLs de acesso do Jenkins.

**Jenkins QA BackEnd e FrontEnd TPO**

[http://192.168.100.10:8080/](http://192.168.100.10:8080/)

Ao acessar o Jenkins, ele solicitará usuário/senha de acesso.

Para ambos os Jenkins, usamos o mesmo usuário/senha.

Usuário: **admin-mirassol**

Senha: **mirassol123***

Recomendamos que futuramente estes dados de acesso, sejam alterados. Usamos estes dados "mais simples" apenas para implantação do projeto. Tão logo a implantação seja concluída, deve ser gerada uma senha mais forte.

Uma vez que no ambiente de QA, estão todos os componentes (FrontEnd, BackEnd, Gateway e HUB TMS), no Jenkins estão dispostos os 4 Jobs correlatos.

![Jenkins QA](documentation/job_jenkins_qa.png)

## Containers

Como citando anteriormente, há muitas aplicações de BackEnd (Múltiplos Endpoints de BackEnd TPO, Gateway TPO, HUB TMS), além é claro de uma aplicação de FrontEnd.

Quando você roda a aplicação localmente, você a executa através de um comando NPM (também já apresentado por aqui).

Entretanto, quando se faz o Deploy destas aplicações em ambientes Produtivos (ou mesmo QA), é recomendável subir tais aplicações em Dockers (ou Containers) de forma que elas estejam sujeitas à algum recurso de gerenciamento, que permite visualização de logs, escalonamento, stop e re-start de serviços, entre outros.

Em suma, rodar localmente com NPM é aceitável.

Mas no servidor, é melhor rodar em Docker.

Sendo assim, usamos uma ferramenta de gerencimento de Containers chamada **Portainer**

**Portainer de Produção**

[http://192.168.100.8:9500/](http://192.168.100.8:9500/)

**Portainer de QA**

[http://192.168.100.10:9000/](http://192.168.100.10:9000/)

Ao acessar o Portainer, ele solicitará usuário/senha de acesso.

Tanto para o Portainer de Produção quanto para o de QA, usamos o mesmo usuário/senha.

Usuário: **admin-mirassol**

Senha: **mirassol123***

Recomendamos que futuramente estes dados de acesso, sejam alterados. Usamos estes dados "mais simples" apenas para implantação do projeto. Tão logo a implantação seja concluída, deve ser gerada uma senha mais forte.

Quando você acessar o Portainer, vá até a seção de Dashboard.

![Dashboard Portainer](documentation/portainer_dashboard.png)

Veja que há 24 Containers em execução:
- 15 Aplicações BackEnd TPO
- 7 Jobs BATCH (serão detalhados mais à frente)
- 1 Gateway TPO
- 1 HUB TMS (Rodopar)

Ao clicar no Link "Containers" você verá todos os 24 Containers listados.

![Containers Portainer](documentation/portainer_containers.png)

Nesta listagem, há várias opções como por exemplo:
- Parar um ou vários Containers
- Iniciar um ou vários Containers
- Visualizar os Logs gerados num Container
- Remover um ou vários Containers
- Entre tantas outras

**Importante**: Em caso de re-inicialização do servidores (QA ou Produção), é possível (mas não provável) que os IPs atribuídos de rede local mudem, e neste caso será necessário atualizar o arquivo de configuração do Gateway (no repositório do BackEnd).

Os novos IPs atribuídos você deve conferir dentro de *Portainer*, menu *Network*, item *Bridge*.
Lá existe a relação dos IPs de cada Container.

Em caso de alteração (você saberá que foi alterado, pois o BackEnd não responderá corretamente), você deverá alterar o arquivo **gateway.config_prod.yml** (para Produção) ou **gateway.config_qa.yml** (para QA).

Segue o local destes arquivos no Repositório do BackEnd.

https://github.com/grupo-mirassol/tpo-backend/torre-gateway/config/gateway.config_prod.yml

https://github.com/grupo-mirassol/tpo-backend/torre-gateway/config/gateway.config_qa.yml



## Entidades MongoDB
Ao longo do processo de desenvolvimento do TPO, foi necessário criar algumas estruturas de dados, como já citado anteriormente, o MongoDB foi a opção de banco de dados para armazenamento de algumas informações.

Aqui serão listadas as principais entidades criadas, e seus respectivos propósitos.

### Entidades de Complementação de Informações do TMS
```
torreMotorista
torreParceiroClassificacao
torreParceiroCustoOperacao
torreParceiroRota
torreParceiroTempoLimite
torreParceiroTempoMovimento
torrePoligono
torrePoligonoTipo
torreRegiaoOperacao
torreRotaDadoComplementar
torreVeiculoClassificacao
torreVeiculoSituacao
torreVeiculoTipoVinculo
```

### Entidades de Autenticação/Login/Perfis de Acesso ao TPO
```
torreFuncionalidade
torreModulo
torrePerfil
torrePerfilPermissao
torreToken
torreUsuario
```

### Entidades para Monitoramento de Pedidos
```
torreMapaSinotico
torreNotificacao
torreOcorrencia
torreOcorrenciaClassificacao
torreOcorrenciaDestinatario
torreOcorrenciaDisparo
torreOcorrenciaOrigem
torreOcorrenciaPrioridade
torreOcorrenciaStatus
torrePedidoMonitoramento
torrePedidoStatus
torreTipoOcorrencia
```

### Entidades de Apoio a Jobs/Logs/Outros
```
torreLogApiGoogle
torreLogRastreador
torreParametroGeral
torreRotina
torreRotinaLog
```


## Processos BATCH

No TPO há 7 processos BATCH. São eles:

- Obtenção de Pedidos para Monitoramento (obter pedidos do SQL Server e montá-los no MongoDB)
  - *Executado de 10 em 10 minutos*

- Atualização periódica de Pedidos para Monitoramento (obter atualização de pedidos do SQL Server para o MongoDB)
  - *Executado de 2 em 2 minutos (Limitado a 20 pedidos por execução)*

- Monitoramento Diário de Motoristas e Veículos
  - *Executado 2x por dia (às 15h e às 23h)*

- Montagem de Mapa Sinótico para Pedidos
  - *Executado de 10 em 10 minutos*

- Monitoramento de Pedidos Novos/Em Alocação
  - *Executado de 10 em 10 minutos*

- Monitoramento de Pedidos Em Viagem
  - *Executado de 60 em 60 minutos*

- Envio de E-mails Ocorrências de Monitoramento
  - *Executado de 1 em 1 minuto*


Para o ambiente de QA ou até mesmo para testes e validações de correções e ajustes, será necessário executar os Jobs manualmente e localmente. Para tal considerar as seguintes instruções.

Primeiramente será necessário que o HUB TMS esteja em execução, uma vez que alguns JOBs obtém informações do TMS para sua execução.

Com o HUB TMS em execução, em outra janela do terminal, vá até o diretório:
```
C:\ghr-tpo\tpo-backend\api\torre\
```

Execute o Job conforme abaixo (cada Job tem uma instrução diferente)

- Obtenção de Pedidos para Monitoramento (obter pedidos do SQL Server e montá-los no MongoDB)
```
npm run startcronpedidosmonitoramentoobtencao
```

- Atualização periódica de Pedidos para Monitoramento (obter atualização de pedidos do SQL Server para o MongoDB)
```
npm run startcronpedidosmonitoramentoatualizacao
```

- Monitoramento Diário de Motoristas e Veículos
```
npm run startcronmonitoramentodiario
```

- Montagem de Mapa Sinótico para Pedidos
```
npm run startcronmapasinotico
```

- Monitoramento de Pedidos Novos/Em Alocação
```
npm run startcronmonitoramentopedidosnovosandemalocacao
```

- Monitoramento de Pedidos Em Viagem
```
npm run startcronmonitoramentopedidosemviagem
```

- Envio de E-mails Ocorrências de Monitoramento
```
npm run startcronemailocorrencias
```

**Importante 1:** Caso seja necessário executar vários Jobs ao mesmo tempo, será necessário abrir uma janela do terminal para cada um dos Jobs em execução.

**Importante 2:** Caso necessário finalizar um Job no meio da execução (com CTRL + C), é prudente fazer isto somente quando a rotina estiver finalizada (será possível ver na console a mensagem de finalização). Caso seja impreterível a finalização do Job no meio da Rotina, isso acarretará em bloqueio na próxima execução do Job, pois ele não foi finalizado corretamente. É possível contornar este problema acessando a entidade `torreRotina` e sinalizando no registro correto, a finalização do Job.


## Principais Verificações MongoDB
Para suporte e manutenção do TPO será necessário, por certas vezes, averiguar dados mantidos no MongoDB.

Para tal, já sugerimos anteriormente o uso ou do Mongo Compass, ou do noSQLBooster, como ferramentas client do MongoDB.

Nesta seção, adicionaremos alguns comandos para consultas (SELECTs) de informações que serão relevantes ao processo de suporte.

#### Como obter todos os Pedidos para Monitoramento EM VIAGEM

```
db.torrePedidoMonitoramento.find(
  {
    tipoMonitoramento: 'EM_VIAGEM',
    statusMonitoramento: 'DISPONIVEL_MONITORAMENTO'
  }
)
```

#### Como agrupar o número de chamadas da API do Google por Pedido

```
db.torreLogApiGoogle.aggregate(
  [
    {
      $group : {
        _id : {
          "pedido": "$numeroPedido", 
          "filial": "$codigoFilial"
        },
        qtd: { $sum: 1 }
      }
    }
  ]
)
```

#### Como identificar as rotinas (Jobs) que estão em Execução

Caso uma rotina esteja marcado como Execução, OU ela realmente estará em execução, OU o JOB/Container foi finalizado antes da marcação de término.
Neste segundo caso, este segundo registro deverá ser EXCLUÍDO.

```
db.torreRotina.find({ status: 'G'})
```

#### Como agrupar os Pedidos em Monitoramento por Tipo (NOVO/ALOCACAO/EM VIAGEM) e Status do Monitoramento (DISPONÍVEL MONITORAMENTO / FINALIZADO)

```
db.torrePedidoMonitoramento.aggregate(
  [
    {
      $group :
        {
          _id : {
              "tipo": "$tipoMonitoramento", 
              "status": "$statusMonitoramento"
          },
          qtd: { $sum: 1 }
        }
     }
   ]
 )
```

#### Como agrupar os Pedidos em Monitoramento por Status do Monitoramento (DISPONÍVEL MONITORAMENTO / FINALIZADO) somente dos Pedidos EM VIAGEM

```
db.torrePedidoMonitoramento.aggregate(
  [
    { 
      $match : {
        tipoMonitoramento : "EM_VIAGEM"
      }
    }, 
    {
      $group :
        {
          _id : {
              "tipo": "$tipoMonitoramento", 
              "status": "$statusMonitoramento"
          },
          qtd: { $sum: 1 }
        }
     }
   ]
 )
```

#### Como consultar todas as chamadas do Rastreador de um Pedido específico

```
db.torreLogRastreador.find({ placa: 'IYY-3143'})
```

#### Como consultar todas as chamadas da API Google de um Pedido específico

```
db.torreLogApiGoogle.find({ placa: 'IYY-3143'})
```

## Testando APIs

Para testes das APIs (BackEnd TPO, Gateway TPO e HUB TMS), que seja em ambiente local, em ambiente QA, ou até mesmo em ambiente de Produção, você poderá utilizar como ferramenta tanto o Swagger, quanto um client de API Rest (neste caso recomendamos o Insomnia).

Para acessar o Swagger Local:
[http://localhost:3000/api/doc/](http://localhost:3000/api/doc/)

Para acessar o Swagger do Ambiente QA:
[http://192.168.100.10:8084/api/doc/](http://192.168.100.10:8084/api/doc/)

Para acessar o Swagger do Ambiente Produção:
[http://192.168.100.8:7084/api/doc/](http://192.168.100.8:7084/api/doc/)

O Swagger resolve "diretamente" a exposição das portas para os testes.

Caso opte pelo Insomnia, você deverá conhecer as portas exatas que precisa testar.

Para isto, consulte o Diagrama de Ambiente específico (Local, QA e Produção)

Todas os endpoints são protegidos por autenticação de Token JWT.

Ou seja, para testar as APIs você deverá se autenticar com um usuário válido.

Para autenticação Local

http://localhost:3000/api/autenticar/login

Para autenticação no QA

http://192.168.100.10:8084/api/autenticar/login

Para autenticação na Produção

http://192.168.100.8:7084/api/autenticar/login

Você deverá realizar a autenticação por qualquer client de API Rest (Swagger, Insomnia, ou outro qualquer).

Ao se autenticar, você receberá um Token.

```
{
  "dados": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWQ5YzlhMjI4NTI4OTAwMWQwZGVlMmMiLCJsb2dpbiI6IkFkbWluaXN0cmFkb3IiLCJlbWFpbCI6ImN1Ym9AY3Vib2Nvbm5lY3QuY29tLmJyIiwibm9tZSI6IkFkbWluaXN0cmFkb3IgZG8gU2lzdGVtYSIsImZpbGlhaXMiOlsxLDEwLDE1LDE5LDIzLDI0LDI2LDMzLDMwLDEsMTAsMTUsMTksMjMsMjQsMjUsMjYsMzAsMzIsMzMsMzQsMzcsMzgsMzksNDBdLCJpYXQiOjE2MDI4NTc0NzYsImV4cCI6MTYwMjk0Mzg3Nn0.7ZnjTS6h1gv26YItKNmM--T8Ndl_gaL9DzKLOqk72Ps",
    "permissoes": [
      {
        "moduloId": "000000000000000000000001",
        "funcionalidadeId": "000000000000000000000001",
        "permiteConsultar": true,
        "permiteAlterar": true
      },
      {
        "moduloId": "5ed9c975285289001d0deda9",
        "funcionalidadeId": "5e42ef89f59bb659d448f4c8",
```

No Swagger já uma opção para AUTENTICAR "todas" as requisições no botão "Authorize". Lá basta informar o Token obtido.

No Insomnia (ou qualquer outro client) você deverá adicionar um chave no header:
```
Key: x-access-token
Value: token-obtido-no-login
```
