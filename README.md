# Delivery Management App

Um aplicativo móvel desenvolvido com Ionic e Angular para gerenciamento de pedidos de entrega.

## Features

- Listar, adicionar, editar e excluir pedidos de entrega;
- Marcar pedidos como entregues com comprovante por foto;
- Filtrar pedidos por status (Todos, Pendentes, Entregues);
- Filtrar pedidos através do campo de busca;
- Visualizar detalhes do pedido, incluindo o comprovante de entrega;
- Integração com o ViaCEP para consulta de endereços;
- Armazenamento local para persistência de dados.

## Requisitos

- Node.js (v14+)
- npm (v6+)
- Ionic CLI
- Android Studio (para Android builds)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/wesllenfe/delivery-management-app
cd delivery-management
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o aplicativo no navegador:
```bash
ionic serve
```

## Construindo para Android

1. Adicione a plataforma Android:
```bash
ionic cap add android
```

2. Construa o aplicativo:
```bash
ionic cap build android
```

3. Abra o Android Studio:
```bash
ionic cap open android
```

## Executando os Testes
1. Para executar os testes unitários:
```bash
ng test
```
