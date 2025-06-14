import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'ES Futures Trader',
    image: 'https://i.pravatar.cc/150?img=1',
    text: "NBS Journal has completely transformed my futures trading. The analytics are incredible, and I've seen a 40% improvement in my win rate.",
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'NQ Futures Trader',
    image: 'https://i.pravatar.cc/150?img=2',
    text: "The emotional tracking feature helped me identify patterns I never noticed before. This tool is a game-changer for serious futures traders.",
    rating: 5
  },
  {
    name: 'Emma Rodriguez',
    role: 'CL Futures Trader',
    image: 'https://i.pravatar.cc/150?img=3',
    text: "I love how easy it is to track my futures trades and analyze my performance. The visual analytics are exactly what I needed.",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-16"
        >
          What Our Traders Say
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10"
            >
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              
              <p className="text-white/80">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 