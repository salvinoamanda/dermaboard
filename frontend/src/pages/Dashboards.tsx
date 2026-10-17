import Navbar from '../components/Navbar';
import Section from '../components/Section';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import AlertBox from '../components/AlertBox';
import Panel from '../components/Panel';
import DashboardFrame from '../components/DashboardFrame';
import { isLoggedIn } from '../utils/auth';
import './Dashboards.css';

const PUBLIC_URL = 'https://app.powerbi.com/view?r=eyJrIjoiYzVmZDJkMDItZjNhMS00YzE5LTlmYzgtYWFhZGU1NjZmN2I4IiwidCI6IjY1MGZkYzAxLTI1NGUtNDE0Yy1hNzY4LTBlMmFjYmFhMGFlNCJ9';
const PRIVATE_URL = 'https://app.powerbi.com/view?r=eyJrIjoiODFhMjUxNTctMDVmNC00NzE2LWI4ZGYtMzQwYjdiN2QxMzI3IiwidCI6IjY1MGZkYzAxLTI1NGUtNDE0Yy1hNzY4LTBlMmFjYmFhMGFlNCJ9';

export default function Dashboards() {
    const isLogged = isLoggedIn();

    return (
        <>
            <Navbar />
            <Section>
                <PageHeader
                    title="Dashboards"
                    subtitle="Análise de dados sobre câncer de pele no Brasil."
                    subtitleSize="small"
                    align="left"
                />
                <Panel border="none" className="dashboard-panels">
                    <DashboardFrame
                        title={isLogged ? 'dashboards_privados_tcc' : 'dashboards_publicos_tcc'}
                        src={isLogged ? PRIVATE_URL : PUBLIC_URL}
                    />
                </Panel>
                <AlertBox
                    message="Os dashboards apresentados neste sistema utilizam bases de dados públicas e oficiais."
                    references={[
                        <>
                            <span className="ref-author-dashboards">Ministério da Saúde</span>. <em>DATASUS</em>. Disponível em: https://datasus.saude.gov.br/. Acesso em: 27 set. 2025.
                        </>,
                        <>
                            <span className="ref-author-dashboards">Ministério da Saúde</span>. <em>Transferência de Arquivos</em>. Disponível em: https://datasus.saude.gov.br/transferencia-de-arquivos/. Acesso em: 25 fev. 2026.
                        </>,
                        <>
                            <span className="ref-author-dashboards">Plataforma de Ciência de Dados aplicada à Saúde (PCDaS)</span>. <em>Sistema de Informações Hospitalares do SUS – SIHSUS: Dicionário de Variáveis</em>. Disponível em: https://pcdas.icict.fiocruz.br/conjunto-de-dados/sistema-de-informacoes-hospitalares-do-sus-sihsus/dicionario-de-variaveis/. DOI: https://doi.org/10.7303/syn26343713. Acesso em: 03 abr. 2026.
                        </>,
                        <>
                            <span className="ref-author-dashboards">Plataforma de Ciência de Dados aplicada à Saúde (PCDaS)</span>. <em>Sistema de Informações Hospitalares do SUS – SIHSUS: Documentação</em>. Disponível em: https://pcdas.icict.fiocruz.br/conjunto-de-dados/sistema-de-informacoes-hospitalares-do-sus-sihsus/documentacao/. DOI: https://doi.org/10.7303/syn26343713. Acesso em: 03 abr. 2026.
                        </>,
                    ]}
                />
            </Section>
            <Footer />
        </>
    );
}