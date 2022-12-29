import pic1 from "../../Static/pic1.jpg";
import pic2 from "../../Static/pic2.jpg";
import pic3 from "../../Static/pic3.jpg";
import './Home.css';

export default function Home() {
    return (
        <>
            <h4 className="section-header">Welcome to Sci-Innova</h4>

            <div id="background">
                <div id="overlay">
                    <div id="about">
                    We are a European governmental organisation that is passionate about supporting the next generation of scientists and engineers. 
                    As part of our commitment to fostering curiosity and innovation in young people, 
                    we are proud to sponsor science projects for youth.
                    <br/><br/>
                    Our sponsorship program is designed to provide financial support to students of Europe
                    who are pursuing ambitious and impactful science projects. 
                    <br/><br/>
                    We are excited to see what the future holds for these young 
                    scientists and the innovative ideas they bring to the table. 
                    <br/><br/>
                    Thank you for considering us as a partner in your journey to make a positive impact on the world
                     through science.
                    </div>
                </div>
            </div>
        </>
    )
}