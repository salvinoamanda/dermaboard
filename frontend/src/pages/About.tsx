import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { CiWarning } from "react-icons/ci";
import { BsArrowReturnRight } from "react-icons/bs";
import Navbar from "../components/Navbar";
import Section from "../components/Section";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import AlertBox from "../components/AlertBox";
import './About.css';

export default function About() {
    return (
        <>
            <Navbar />
            <Section>
                <PageHeader
                    title="Sobre o câncer de pele"
                    subtitle="Informações sobre o câncer de pele, seus tipos, fatores de risco, prevenção e cuidados."
                    subtitleSize="small"
                    align="left"
                />
                <Panel theme="dark" border="horizontal" className="general-details">
                    <PageHeader title="Detalhes gerais" align="left" level="h3" />
                    <p>
                        O câncer de pele é o <strong>mais comum</strong> no Brasil, correspondendo a <strong>30%</strong> de todas as neoplasias malignas, sendo a maior parte dos casos do tipo não melanoma, que possui altas chances de cura se detectado precocemente, e cerca de <strong>4%</strong> desse total do tipo melanoma, que é mais agressivo devido à grande probabilidade de metástase.
                    </p>
                    <br />
                    <p>
                        <span className="definition">Definição:</span> Ele acontece quando as células da pele se dividem de forma descontrolada.
                    </p>
                </Panel>
                <div className="non-melanoma-wrapper">
                    <PageHeader title="Tipos de câncer de pele" align="left" level="h2" />
                    <PageHeader title="Não melanoma" align="left" level="h3" />
                    <Panel border="none" shadow className="basal-cell-carcinoma">
                        <span className="title">Carcinoma basocelular (CBC)</span>
                        <p>
                            É o tipo mais comum de câncer de pele. Surge nas células basais, localizadas na parte mais profunda da epiderme. Costuma aparecer em áreas mais expostas ao sol, como rosto, pescoço, cabeça e braços.
                        </p>
                        <br />
                        <span className="features">Características:</span>
                        <p>
                            <span><FiArrowRight size={22} /></span> Cresce lentamente e raramente se espalha, mas pode atingir tecidos mais profundos se não for tratado. 
                        </p>
                    </Panel>
                    <Panel border="none" shadow className="squamous-cell-carcinoma">
                        <span className="title">Carcinoma espinocelular (CEC)</span>
                        <p>
                            Origina-se nas células escamosas, que formam a camada superficial da pele. Este aparece nas mesmas regiões do CBC, com adição de locais como orelhas, lábios e mãos.
                        </p>
                        <br />
                        <br />
                        <span className="features">Características:</span>
                        <p>
                            <span><FiArrowRight size={22} /></span> Pode surgir também em feridas que não cicatrizam ou em cicatrizes antigas.
                        </p>
                        <p>
                            <span><FiArrowRight size={22} /></span> Tem maior chance de se espalhar em comparação ao CBC.
                        </p>
                    </Panel>
                </div>
                <div className="melanoma-title"><PageHeader title="Melanoma" align="left" level="h3" /></div>
                <Panel border="none" shadow className="melanoma">
                    <span className="title">
                        <CiWarning size={36} />
                        Melanoma
                    </span>
                    <p>
                        É o tipo menos comum, mas é também o mais agressivo. Desenvolve-se nos melanócitos, células que produzem melanina, o pigmento que dá cor à pele.
                    </p>
                    <br />
                    <span className="features">Características:</span>
                    <p>
                        <span><FiArrowRight size={22} /></span> Pode surgir em qualquer parte do corpo, com maior frequência em rosto, pescoço, tronco (homens) e pernas (mulheres).
                    </p>
                    <p>
                        <span><FiArrowRight size={22} /></span> Apresenta alto risco de metástase e exige diagnóstico precoce.
                    </p>
                </Panel>
                <Panel border="horizontal" className="risk-factors">
                    <PageHeader title="Fatores de risco" align="left" level="h3" />
                    <ul>
                        <li>Exposição Solar (UV);</li>
                        <li>Histórico de Saúde Familiar;</li>
                        <li>Características Genéticas;</li>
                        <li>Exposição a Agentes Químicos e Radiação Artificial.</li>
                    </ul>
                    <strong className="specific">Específicos:</strong>
                    <div className="specific-factors">
                        <div>
                            <strong>Não melanoma</strong>
                            <ul>
                                <li>Contato com substâncias físicas;</li>
                                <li>Baixa imunidade.</li>
                            </ul>
                        </div>
                        <div>
                            <strong>Melanoma</strong>
                            <ul>
                                <li>Contato com os vírus Epstein-Barr;</li>
                                <li>Contato com os vírus HIV-1.</li>
                            </ul>
                        </div>
                    </div>
                </Panel>
                <PageHeader title="Prevenção e cuidados" align="center" level="h2" />
                <Panel border="none" shadow className="prevention">
                    <p>
                        <FiCheckCircle size={22} /> <strong>Uso contínuo de protetor solar;</strong>
                    </p>
                    <p>
                        <FiCheckCircle size={22} /> <strong>Proteção física contra o sol com acessórios como chapéu e óculos escuro;</strong>
                    </p>
                    <p>
                        <FiCheckCircle size={22} /> <strong>Diminuição da exposição direta à radiação solar;</strong>
                    </p>
                    <p>
                        <FiCheckCircle size={22} /> <strong>Realização do autoexame mensalmente:</strong>
                    </p>
                    <p className="sub-item">
                        Examinar o corpo todo com os braços levantados, incluindo partes menos visíveis:
                    </p>
                    <p className="sub-item">
                        <BsArrowReturnRight size={22} /> Partes laterais, posteriores e inferiores;
                    </p>
                    <p className="sub-item">
                        <BsArrowReturnRight size={22} /> Braços, antebraços, mãos, pernas e pés (inclusive plantas e entre os dedos);
                    </p>
                    <p className="sub-item">
                        <BsArrowReturnRight size={22} /> Pescoço, couro cabeludo, região genital e nádegas.
                    </p>
                </Panel>
                <AlertBox
                    message="O conteúdo desta página é baseado em fontes fontes científicas e governamentais."
                    references={[
                        <>
                            <span className="ref-author-about">American Cancer Society</span>. <em>What Is Melanoma Skin Cancer?</em> Disponível em: https://www.cancer.org/cancer/types/melanoma-skin-cancer/about/what-is-melanoma.html. Acesso em: 23 ago. 2025.
                        </>,
                        <>
                            <span className="ref-author-about">American Cancer Society</span>. <em>What Is Basal and Squamous Cell Skin Cancer?</em> Disponível em: https://www.cancer.org/cancer/types/basal-and-squamous-cell-skin-cancer/about/what-is-basal-and-squamous-cell.html. Acesso em: 25 ago. 2025.
                        </>,
                        <>
                            <span className="ref-author-about">CARMINATE, C. B.; ROCHA, A. B.; GOMES, B. P.; NAKAGAWA, F. N. F.; DE OLIVEIRA, G. L.; VIEIRA, J. F.; ALMEIDA, L. M. R.; FERREIRA, L. D. T.; ANDRADE, P. D. M.; SILVA, R. A.</span> <em>Detecção precoce do câncer de pele na atenção básica</em>. Revista Eletrônica Acervo Saúde, v. 13, n. 9, p. e8762, 2021.
                        </>,
                        <>
                            <span className="ref-author-about">Instituto Nacional de Câncer (INCA)</span>. <em>Câncer de pele melanoma</em>. Disponível em: https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/pele-melanoma. Acesso em: 08 jun. 2025.
                        </>,
                        <>
                            <span className="ref-author-about">Instituto Nacional de Câncer (INCA)</span>. <em>Câncer de pele não melanoma</em>. Disponível em: https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/pele-nao-melanoma. Acesso em: 08 jun. 2025.
                        </>,
                        <>
                            <span className="ref-author-about">LIMA, N. A.; ROMÃO, T.; MURARA, P.</span> <em>Estudo preliminar sobre o câncer de pele no Brasil a partir de uma perspectiva geográfica</em>. Hygeia - Revista Brasileira de Geografia Médica e da Saúde, v. 17, p. 71–80, 2021.
                        </>,
                        <>
                            <span className="ref-author-about">Ministério da Saúde</span>. <em>Câncer de pele</em>. Disponível em: https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/c/cancer-de-pele. Acesso em: 07 jun. 2025.
                        </>,
                        <>
                            <span className="ref-author-about">POEYS, Nathalia Barros; PARENTE, B. P.</span> <em>A importância da prevenção e detecção precoce do câncer de pele</em>. Revista Ibero-Americana de Humanidades, Ciências e Educação, v. 9, n. 6, p. 2445–2454, 2023.
                        </>,
                    ]}
                />
            </Section>
            <Footer />
        </>
    );
}