import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ChevronRight, Star, ShoppingBag, Clock, Award, Phone, Mail, MapPin,
  Facebook, Twitter, Instagram, Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const navigate = useNavigate();

  const goToJoinUs = () => navigate('/joinus');

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail('');
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const floatVariant = {
    animate: {
      y: [0, -15, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const floatDelayed = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#3673B4] z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-md z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#3673B4] rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RMS</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {['Home', 'About Us', 'Shop', 'Testimonial', 'Contact Us'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-700 hover:text-[#3673B4] font-medium transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <motion.a
                href="tel:+919876543210"
                className="hidden sm:flex items-center gap-2 text-[#3673B4] font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="w-4 h-4" />
                <span>(+977) 98 xxxx xxxx</span>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToJoinUs}
                className="bg-[#3673B4] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2a5a94] transition"
              >
                Join Us
              </motion.button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            {['Home', 'About Us', 'Shop', 'Blog', 'Contact Us'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </motion.nav>

      <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6 order-2 lg:order-1"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-block bg-[#3673B4]/10 text-[#3673B4] px-4 py-1 rounded-full text-sm font-semibold"
              >
                #1 We Make Best Taste
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Choose Delicacy<br />
                <motion.span
                  initial={{ backgroundPosition: '0%' }}
                  animate={{ backgroundPosition: '200%' }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-[#3673B4] bg-gradient-to-r from-[#3673B4] via-[#5a92d6] to-[#3673B4] bg-clip-text text-transparent bg-[length:200%_200%]"
                >
                  The Best Healthy
                </motion.span><br />
                Way To Life
              </motion.h1>

              <motion.button
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToJoinUs}
                className="bg-[#3673B4] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#2a5a94] transition flex items-center gap-2 group"
              >
                Shop More
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </motion.button>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4 pt-8"
              >
                {[
                  { name: "Pizza With Extra Toppings", price: "Rs 600", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop" },
                  { name: "Pizza Margherita Cheese", price: "Rs 600", img: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=200&h=150&fit=crop" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ y: -8, scale: 1.03 }}
                    className="bg-blue-50 p-4 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
                  >
                    <img src={item.img} alt={item.name} className="w-full h-24 object-cover rounded-lg mb-3" />
                    <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                    <div className="flex items-center gap-1 my-1">
                      {[1,2,3].map(i => <Star key={i} className="w-3 h-3 fill-[#3673B4] text-[#3673B4]" />)}
                      <Star className="w-3 h-3 text-gray-300" />
                      <Star className="w-3 h-3 text-gray-300" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Medium</span>
                      <span className="font-bold text-[#3673B4] text-sm">{item.price}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative">
                <motion.div
                  style={{ scale: scaleProgress }}
                  className="w-full aspect-square max-w-lg mx-auto bg-[#3673B4] rounded-full p-8 relative overflow-hidden"
                >
                  <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop"
                      alt="Grilled Fish"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </motion.div>

                <motion.img
                  variants={floatVariant}
                  animate="animate"
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop"
                  alt="Salad"
                  className="absolute top-0 right-0 w-24 h-24 rounded-full shadow-xl"
                />
                <motion.img
                  variants={floatDelayed}
                  animate="animate"
                  src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=150&h=150&fit=crop"
                  alt="Pasta"
                  className="absolute top-1/3 -left-8 w-28 h-28 rounded-full shadow-xl"
                />
                <motion.img
                  variants={floatVariant}
                  animate="animate"
                  src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=150&h=150&fit=crop"
                  alt="Salad Bowl"
                  className="absolute bottom-12 right-8 w-24 h-24 rounded-full shadow-xl"
                />
                <motion.img
                  variants={floatDelayed}
                  animate="animate"
                  src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150&h=150&fit=crop"
                  alt="Soup"
                  className="absolute bottom-24 -left-4 w-20 h-20 rounded-full shadow-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <p className="text-[#3673B4] font-semibold mb-2 uppercase text-sm tracking-wide">WHAT WE SERVE</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your Favourite Food<br />Delivery Partner</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: ShoppingBag, title: "Easy To Order", desc: "Order in just a few taps with our seamless interface." },
              { icon: Clock, title: "Fastest Delivery", desc: "Get your food delivered hot and fresh in under 30 mins." },
              { icon: Award, title: "Best Quality", desc: "Premium ingredients and chef-crafted meals every time." }
            ].map((service, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center p-8 rounded-xl hover:shadow-2xl transition bg-gradient-to-b from-white to-gray-50"
              >
                <div className="w-20 h-20 bg-[#3673B4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-10 h-10 text-[#3673B4]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#3673B4]/5 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[#3673B4] rounded-full opacity-10 blur-3xl"></div>
              <motion.img
                whileHover={{ scale: 1.05, rotate: 2 }}
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop"
                alt="Burger"
                className="relative rounded-full w-full max-w-md mx-auto shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-[#3673B4] font-semibold uppercase text-sm tracking-wide">WHAT THEY SAY</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Food Quality Is The<br />Most Important Part<br />For Taste</h2>
              <p className="text-gray-600 leading-relaxed">
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form by injected randomised words.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToJoinUs}
                className="bg-[#3673B4] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a5a94] transition flex items-center gap-2"
              >
                Shop Now
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="shop" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12"
          >
            <p className="text-[#3673B4] font-semibold mb-2 uppercase text-sm tracking-wide">OUR CATEGORIES</p>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Browse Our Top Food Categories</h2>
              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-[#3673B4] font-semibold"
              >
                See All
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { name: 'Cheese Burger', price: 'Rs 600', rating: 3, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=250&fit=crop' },
              { name: 'French fries', price: 'Rs 300', rating: 3, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=250&fit=crop' },
              { name: 'Cheese Pizza', price: 'Rs 400', rating: 3, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=250&fit=crop' },
              { name: 'Veg Sandwich', price: 'Rs 800', rating: 3, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=250&fit=crop' }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition overflow-hidden group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < item.rating ? 'fill-[#3673B4] text-[#3673B4]' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="font-bold text-[#3673B4]">{item.price}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-[#3673B4]/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <p className="text-[#3673B4] font-semibold mb-2 uppercase text-sm tracking-wide">OUR MENU</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Menu That Always Make<br />You Feel In Best Meal</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { name: 'Oreo Shake', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop', tag: 'TOP SELLER' },
              { name: 'Dal Fry', image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=300&h=200&fit=crop', tag: 'TOP SELLER' },
              { name: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop', tag: 'TOP SELLER' },
              { name: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=200&fit=crop', tag: 'TOP SELLER' }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group cursor-pointer"
              >
                <div className="relative overflow-hidden h-48">
                  <div className="absolute top-3 left-3 bg-[#3673B4] text-white px-3 py-1 rounded-full text-xs font-semibold z-10 animate-pulse">
                    {item.tag}
                  </div>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Lorem ipsum dolor sit amet, dipiscing elit, sed</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <p className="text-[#3673B4] font-semibold mb-2 uppercase text-sm tracking-wide">TESTIMONIAL</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Clients About Us</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center"
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
              alt="Customer"
              className="w-32 h-32 rounded-full object-cover shadow-lg flex-shrink-0"
            />
            <div className="flex-1">
              <div className="text-6xl md:text-8xl text-[#3673B4] leading-none mb-4">"</div>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
              </p>
              <div>
                <p className="font-bold text-gray-900 text-lg">Carry Mint</p>
                <p className="text-[#3673B4]">Food Expert</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#3673B4] to-[#2a5a94]">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Subscribe To Our Newsletter</h2>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mt-8">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-4 focus:ring-white/30 transition"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubscribe}
              className="bg-white text-[#3673B4] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition"
            >
              SUBSCRIBE
            </motion.button>
          </div>
        </motion.div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8"
          >
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#3673B4] rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">RMS</span>
              </div>
              <p className="text-gray-400 text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            </motion.div>

            {['OUR LINKS', 'OTHER LINKS', 'CONTACT'].map((title, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <h4 className="font-bold mb-4">{title}</h4>
                {title === 'CONTACT' ? (
                  <ul className="space-y-3 text-gray-400 text-sm">
                    <li className="flex items-start gap-2"><MapPin className="w-5 h-5 mt-0.5" />123 Kathmandu, Nepal</li>
                    <li className="flex items-center gap-2"><Phone className="w-5 h-5" />+977 98 xxxx xxxx</li>
                    <li className="flex items-center gap-2"><Mail className="w-5 h-5" />info@RMS.com</li>
                  </ul>
                ) : (
                  <ul className="space-y-2 text-gray-400 text-sm">
                    {['Home', 'About Us', 'Services', 'Team', 'Blog'].map((link) => (
                      <li key={link}><a href="#" className="hover:text-white transition">{link}</a></li>
                    ))}
                  </ul>
                )}
                {title === 'CONTACT' && (
                  <div className="flex gap-3 mt-4">
                    {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.2, backgroundColor: '#3673B4' }}
                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition"
                      >
                        <Icon className="w-5 h-5" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400"
          >
            <p>Copyright 2023 All right reserved.</p>
            <p>Powered by <span className="text-[#3673B4]">Dexignzone</span></p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;