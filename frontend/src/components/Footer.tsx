import './Footer.css';

const START_YEAR = 2025;

export default function Footer(){
    const currentYear = new Date().getFullYear();
    const yearLabel = currentYear > START_YEAR
        ? `${START_YEAR}-${currentYear}`
        : `${START_YEAR}`;

    return(
        <footer>
            <div>
                <p>&copy; {yearLabel} DermaBoard.<br /> Sistema informativo para análise e monitoramento de câncer de pele no Brasil</p>
            </div>
        </footer>
    );
}

