# Relatório UCAQ - Documentação

## Visão Geral

O aplicativo "Relatório UCAQ" é uma ferramenta web progressiva (PWA) para registro de operações realizadas pela Unidade de Circulação de Água Quente (UCAQ). Ele permite que operadores e auxiliares registrem diversas atividades, como deslocamentos, operações, aguardos, mobilizações e desmobilizações durante suas operações de campo.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
relatorioucaq/
├── css/
│   └── style.css         # Estilos da aplicação
├── js/
│   └── app.js            # Código JavaScript principal
├── pages/                # Páginas HTML carregadas dinamicamente
│   ├── abastecimento.html
│   ├── aguardo.html
│   ├── deslocamento.html
│   ├── desmobilizacao.html
│   ├── details.html
│   ├── equipe.html
│   ├── home.html
│   ├── mobilizacao.html
│   ├── operacoes.html
│   ├── relatorio.html
│   ├── repouso.html
│   └── sobre.html
├── index.html            # Página principal que contém a estrutura base da aplicação
├── logo-ucaq.png         # Logo original
├── logo-ucaq-nova.png    # Logo atualizada
└── main.js               # Script complementar com funções adicionais
```

## Funcionalidades Principais

O aplicativo possui as seguintes funcionalidades:

1. **Registro de Equipe**: Permite registrar informações da equipe (operador, auxiliar, data, poço).

2. **Deslocamento**: Registra deslocamentos entre locais, incluindo:

   - Origem e destino
   - Horários de início e fim
   - Quilometragem inicial e final

3. **Operações**: Registra operações realizadas no poço, incluindo:

   - Tipo de atividade
   - Horários de início e fim
   - Volume, temperatura e pressão (quando aplicáveis)
   - Observações

4. **Aguardo**: Registra períodos de aguardo, com motivo e duração.

5. **Mobilização/Desmobilização**: Registra atividades de mobilização e desmobilização.

6. **Abastecimento**: Registra abastecimentos realizados.

7. **Repouso/Alimentação**: Registra períodos de repouso e alimentação.

8. **Relatório**: Gera um relatório completo com todas as informações registradas.

## Armazenamento de Dados

O aplicativo utiliza o `localStorage` do navegador para armazenar todos os dados, o que significa que:

- Os dados persistem mesmo depois de fechar o navegador
- Os dados ficam armazenados apenas no dispositivo do usuário
- Não há necessidade de conexão com internet para salvar ou visualizar os dados

Cada tipo de registro é armazenado em uma chave separada:

- `ucaq_equipe`
- `ucaq_deslocamento`
- `ucaq_operacao`
- `ucaq_aguardo`
- `ucaq_mobilizacao`
- `ucaq_desmobilizacao`
- `ucaq_abastecimento`
- `ucaq_repouso`

## Interface do Usuário

A interface é responsiva e adaptada para uso em dispositivos móveis:

- **Menu Lateral**: Em telas grandes, é sempre visível. Em dispositivos móveis, pode ser aberto/fechado com um botão.
- **Navegação Simplificada**: Cada tela possui botões de "Voltar" e "Próximo" para facilitar o preenchimento em sequência.
- **Cards Informativos**: Exibe dados já registrados em cards para fácil visualização.

## Como Usar

1. **Iniciar o Aplicativo**: Abra o arquivo `index.html` no navegador.

2. **Registrar Equipe**: Preencha os dados da equipe (operador, auxiliar, data, poço) e salve.

3. **Registrar Atividades**: Navegue pelas diferentes seções para registrar:

   - Deslocamentos
   - Operações
   - Aguardos
   - Mobilizações/Desmobilizações
   - Abastecimentos
   - Períodos de repouso

4. **Visualizar Relatório**: Acesse a seção "Relatório" para ver um resumo de todas as informações registradas.

5. **Limpar Dados**: Na seção "Relatório", use o botão "Limpar Relatório" para remover todos os dados salvos.

## Funcionamento Técnico

O aplicativo utiliza:

- **HTML5**, **CSS3** e **JavaScript** puro (sem frameworks)
- **Carregamento dinâmico** de páginas via AJAX
- **localStorage** para persistência de dados
- **Design responsivo** para funcionar em dispositivos móveis e desktop
- **FontAwesome** para ícones

## Limitações

- Dados armazenados apenas localmente (não há sincronização com servidores)
- Não há funcionalidade de exportação para PDF ou outros formatos
- Não há sistema de autenticação de usuários

## Sugestões de Melhorias Futuras

1. Adicionar exportação para PDF
2. Implementar sincronização com servidor
3. Adicionar sistema de autenticação
4. Implementar histórico de relatórios
5. Adicionar funcionalidade de fotos/imagens
