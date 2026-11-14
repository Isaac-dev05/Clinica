const services = [
    { id: 'geral', name: 'Consulta geral', week: 150, saturday: 180 },
    { id: 'pediatria', name: 'Pediatria', week: 160, saturday: 190 },
    { id: 'nutricao', name: 'Nutrição', week: 140, saturday: 170 },
    { id: 'exames', name: 'Exames', week: 100, saturday: 120 },
    { id: 'fisioterapia', name: 'Fisioterapia', week: 120, saturday: 150 }
];
const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
function localDate(now = new Date()) {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
function slotsFor(date, now = new Date()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
    const day = new Date(`${date}T12:00:00`);
    if (Number.isNaN(day.getTime()) || localDate(day) !== date || date < localDate(now) || day.getDay() === 0) return [];
    const slots = [];
    const close = day.getDay() === 6 ? 12 : 18;
    for (let hour = 8; hour < close; hour++) {
        for (const minute of ['00', '30']) {
            const time = `${String(hour).padStart(2, '0')}:${minute}`;
            if (new Date(`${date}T${time}:00`) > now) slots.push(time);
        }
    }
    return slots;
}
document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === page) link.setAttribute('aria-current', 'page');
    });
    if ($('service-search')) {
        const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        $('service-search').addEventListener('input', () => {
            let count = 0;
            document.querySelectorAll('[data-service]').forEach(card => {
                card.hidden = !normalize(card.dataset.service).includes(normalize($('service-search').value));
                if (!card.hidden) count++;
            });
            $('search-status').textContent = count ? `${count} serviços encontrados.` : 'Nenhum serviço encontrado. Tente outro nome.';
        });
    }
    if ($('appointment-form')) {
        const service = $('service');
        services.forEach(item => service.add(new Option(item.name, item.id)));
        const requested = new URLSearchParams(location.search).get('servico');
        if (services.some(item => item.id === requested)) service.value = requested;
        $('date').min = localDate();
        function refresh() {
            $('summary').hidden = true;
            const times = slotsFor($('date').value);
            $('time').replaceChildren(new Option(times.length ? 'Selecione um horário' : 'Escolha uma data de atendimento', ''));
            times.forEach(time => $('time').add(new Option(time, time)));
            $('time').disabled = !times.length;
            $('date-help').textContent = $('date').value && !times.length ? 'Sem horários nesta data. Escolha um dia futuro de segunda a sábado.' : 'Segunda a sexta: 8h–18h. Sábado: 8h–12h. Horários ilustrativos.';
            const selected = services.find(item => item.id === service.value);
            const saturday = new Date(`${$('date').value}T12:00:00`).getDay() === 6;
            $('estimate').textContent = `Valor de referência: ${money(saturday ? selected.saturday : selected.week)}${$('date').value ? '' : ' (segunda a sexta)'}. Confirme o valor com a clínica.`;
        }
        $('date').addEventListener('change', refresh);
        service.addEventListener('change', refresh);
        $('time').addEventListener('change', () => { $('summary').hidden = true; });
        $('appointment-form').addEventListener('submit', event => {
            event.preventDefault();
            if (!slotsFor($('date').value).includes($('time').value)) { refresh(); $('date').focus(); return; }
            const selected = services.find(item => item.id === service.value);
            const date = new Date(`${$('date').value}T12:00:00`);
            $('summary').textContent = `Simulação de consulta\n${selected.name} · ${date.toLocaleDateString('pt-BR')} às ${$('time').value}\nValor de referência: ${money(date.getDay() === 6 ? selected.saturday : selected.week)}\nNenhuma consulta foi reservada. A disponibilidade e o valor precisam ser confirmados pela clínica.`;
            $('summary').hidden = false;
        });
        refresh();
    }
    const contact = $('contact-form');
    if (contact) {
        contact.addEventListener('submit', event => {
            event.preventDefault();
            $('contact-status').textContent = 'Mensagem não enviada: o canal de atendimento ainda não foi configurado. Este formulário é demonstrativo e não salva seus dados.';
        });
        contact.addEventListener('reset', () => { $('contact-status').textContent = ''; });
    }
});
