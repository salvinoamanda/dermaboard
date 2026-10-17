interface SectionProps {
    children: React.ReactNode;
}

export default function Section({ children }: SectionProps) {
    return(
       <section className="section">
            {children}
       </section> 
    );
}