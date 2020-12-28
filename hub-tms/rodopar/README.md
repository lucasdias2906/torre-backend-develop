**Roteiro**

Instalar o serverless

```sh
npm install -g serverless
```

Atualizar projeto

```sh
npm install
serverless dynamodb install
```

Atualizar credenciais

```sh
serverless config credentials --provider aws --key 1234 --secret 5678
```

Testar offline

```sh
serverless offline start
```

Testar

```sh
npm test
```

Publicar

```sh
serverless deploy -v
```

Chamar

```sh
serverless invoke -f nome-da-funcao -l
```

Remover publicações

```sh
serverless remove
```

**Configurando o arquivo .env**

Criar no projeto o arquivo .env com as seguintes variaveis:

```sh
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
DB_HOST=
DB_PORT=
```
