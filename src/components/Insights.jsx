export default function Insights({ insights }) {
    return (
        <div className="card">
            <h2>Onde economizar</h2>

            {insights.length === 0 ? (
                <p className="muted small">
                    Cadastre transações deste mês para ver sugestões.
                </p>
            ) : (
                <ul className="insights">
                    {insights.map((item, index) => (
                        <li key={index} className={`insight-item ${item.type}`}>
                            {item.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
