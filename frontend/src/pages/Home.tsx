import { FiTrendingUp, FiActivity, FiUsers } from 'react-icons/fi';
import { TfiBarChart, TfiBook } from 'react-icons/tfi';
import Navbar from '../components/Navbar';
import Section from '../components/Section';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Panel from '../components/Panel';
import ExploreCard from '../components/ExploreCard';
import AlertBox from '../components/AlertBox';
import './Home.css';

export default function Home() {
    return (
       <>
            <Navbar />                
                <Section>
                    <PageHeader
                        title="Monitoramento de câncer de pele no Brasil"
                        subtitle="Sistema informativo com análise de dados e informações sobre o câncer de pele, ampliando a compreensão e conscientização da doença."
                        subtitleSize="large"
                        align="center"
                    />
                    <Panel border="horizontal" className="stats-wrapper">
                        <div className="stats">
                            <StatCard icon={<FiTrendingUp size={28} />} value="106,8 mil" label="Projeção de casos para 2026" />
                            <StatCard icon={<FiActivity size={28} />} value="1.124" label="Óbitos por ano" />
                            <StatCard icon={<FiUsers size={28} />} value="44,79" label="Incidência por 100 mil habitantes" />
                        </div>
                    </Panel>
                    <div className="explore-about-bg">
                        <div className="explore-about-wrapper">
                            <div className="explore-column">
                                <PageHeader title="Explore a plataforma" align="center" level="h2" />        
                                <div className="explore-cards">
                                    <ExploreCard
                                        icon={<TfiBarChart size={28} />}
                                        iconColor="#C07404"
                                        title="Dashboards interativos"
                                        description="Explore dados estatísticos sobre a incidência e evolução do câncer de pele."
                                        path="/dashboards"
                                    />
                                    <ExploreCard
                                        icon={<TfiBook size={28} />}
                                        iconColor="#40BF66"
                                        title="Informações sobre o câncer de pele"
                                        description="Saiba sobre os principais tipos de câncer de pele e como se prevenir."
                                        path="/about"
                                    />
                                </div>
                            </div>
                            <Panel theme="dark" className="about-project">
                                <PageHeader title="Sobre o projeto" align="left" level="h3" />
                                <p>
                                    O sistema foi desenvolvido como Projeto Final de Curso com o propósito de fornecer conhecimento sobre o câncer de pele no Brasil à população.
                                </p>
                                <br />
                                <p>
                                    <strong>Observação:</strong> Este sistema possui caráter exclusivamente educativo e informativo, não substituindo consultas médicas nem realizando diagnósticos.
                                </p>
                            </Panel>
                        </div>
                    </div>
                    <AlertBox message="Este sistema utiliza dados e informações provenientes de fontes científicas e oficiais." />
                </Section>
            <Footer />
       </>
    );
}