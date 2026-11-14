# Clínica Bem-Estar
**Projeto desenvolvido exclusivamente para fins de estudo.** A Clínica Bem-Estar é fictícia: imagens, serviços, contatos e valores são ilustrativos. O site não oferece atendimento médico nem realiza agendamentos reais.

Site estático em HTML, CSS e JavaScript, sem dependências.

## Abrir localmente
Na raiz do repositório, execute:
```sh
python -m http.server 8081 --bind 127.0.0.1 --directory SITE/html
```
Acesse http://127.0.0.1:8081.

## Recursos
- Busca de especialidades, incluindo pesquisa sem acentos.
- Simulação de consulta com preços da tabela existente e diferença aos sábados.
- Bloqueio de domingos, datas inválidas, datas passadas e horários encerrados, usando o horário local do navegador.
- Resumo da simulação, perguntas frequentes e navegação acessível.
- Layout responsivo e tabela com rolagem em telas pequenas.

O simulador não reserva consultas nem representa disponibilidade real. Contatos e endereço são exemplos a substituir antes da publicação para pacientes. O formulário de contato não envia ou salva dados. Preços e horários devem ser confirmados pela clínica, inclusive feriados. Não há integração de servidor ou autenticação.

## Testar
Execute `node clinic.test.cjs` e `node --check SITE/html/clinic.js`. Os testes verificam regras de datas, horários e valores; a inspeção visual em navegador deve ser feita separadamente.
