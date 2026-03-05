import React from 'react';

const AboutPage = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-display font-bold text-center mb-8">About Us</h1>
            <div className="max-w-3xl mx-auto text-gray-700 dark:text-gray-300 space-y-6 text-lg">
                <p>Welcome to <strong>FreshMart</strong>, your number one source for all things fresh and organic. We're dedicated to giving you the very best of grocery products, with a focus on dependability, customer service, and uniqueness.</p>
                <p>Founded in 2026, FreshMart has come a long way from its beginnings. When our founder first started out, their passion for eco-friendly, fresh food drove them to do intense research, and gave them the impetus to turn hard work and inspiration into to a booming online store. We now serve customers all over the country, and are thrilled to be a part of the fair trade wing of the grocery industry.</p>
                <p>We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.</p>
                <p className="font-semibold text-center mt-8">Sincerely,<br />The FreshMart Team</p>
            </div>
        </div>
    );
};

export default AboutPage;
