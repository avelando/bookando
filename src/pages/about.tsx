import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const About: React.FC = () => {
    const [data, setData] = useState<{ message: string } | null>(null);

    useEffect(() => {
        fetch("/api/about")
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

    return (
        <div>
            <Header />
            <h1>About</h1>
            {data && <p>{data.message}</p>}
        </div>
    );
};

export default About;
