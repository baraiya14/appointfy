import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const features = [
    {
      title: 'Easy Appointment Booking',
      description: 'Book appointments with doctors online without any hassle',
      icon: '📅',
    },
    {
      title: 'Specialist Doctors',
      description: 'Access to specialized healthcare professionals',
      icon: '👨‍⚕️',
    },
    {
      title: 'Medical Records',
      description: 'Secure storage and access to your medical history',
      icon: '📋',
    },
    {
      title: 'Reminders & Notifications',
      description: 'Get timely reminders for your upcoming appointments',
      icon: '🔔',
    },
  ];

  const testimonials = [
    {
      name: 'John Smith',
      comment: 'The online booking system made it so easy to schedule my appointment. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Sarah Johnson',
      comment: 'I was able to find a specialist and book an appointment all within minutes. Great service!',
      rating: 4,
    },
    {
      name: 'Mike Thompson',
      comment: 'The reminders feature helped me never miss an appointment again. Very convenient!',
      rating: 5,
    },
  ];

  return (
    <div>
      {/* Hero Section with Background Image */}
      <div className="hero-background">
        <div className="container mx-auto px-4">
          {/* White Card Container */}
          <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-8">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary-dark">
                  Your Health, Our Priority
                </h1>
                <p className="text-xl mb-8 text-gray-600">
                  Book appointments with healthcare professionals online and manage your medical records with ease.
                </p>
                <Link to="/signup" className="bg-primary text-white px-6 py-3 rounded font-semibold inline-block">
                  Sign Up Now
                </Link>
              </div>
              <div className="lg:w-1/2 lg:pl-10">
                <img 
                  src="https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg" 
                  alt="Healthcare Professional" 
                  className="rounded-lg shadow-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="features-title mb-16">Our Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="features-title mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8">
            <div className="text-center mb-8 md:mb-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2 text-primary-dark">Create an Account</h3>
              <p className="text-gray-600 max-w-xs mx-auto">Sign up and create your personal profile</p>
            </div>
            <div className="hidden md:block">
              <svg className="w-8 h-8 text-primary-light" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="text-center mb-8 md:mb-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2 text-primary-dark">Find a Doctor</h3>
              <p className="text-gray-600 max-w-xs mx-auto">Browse specialists based on your needs</p>
            </div>
            <div className="hidden md:block">
              <svg className="w-8 h-8 text-primary-light" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2 text-primary-dark">Book Appointment</h3>
              <p className="text-gray-600 max-w-xs mx-auto">Schedule your visit at a convenient time</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="features-title mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card bg-white">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-accent' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <h4 className="font-semibold text-primary-dark">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of users who have simplified their healthcare journey with our booking platform.
          </p>
          <Link to="/signup" className="bg-white text-primary-dark px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 inline-block shadow">
            Sign Up Now
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-primary-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Health Booking</h3>
              <p className="text-primary-light">Your trusted healthcare appointment booking platform.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-primary-light hover:text-white transition duration-300">Home</Link></li>
                <li><Link to="/appointment" className="text-primary-light hover:text-white transition duration-300">Book Appointment</Link></li>
                <li><Link to="/login" className="text-primary-light hover:text-white transition duration-300">Login</Link></li>
                <li><Link to="/signup" className="text-primary-light hover:text-white transition duration-300">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-light hover:text-white transition duration-300">Find Doctors</a></li>
                <li><a href="#" className="text-primary-light hover:text-white transition duration-300">Health Records</a></li>
                <li><a href="#" className="text-primary-light hover:text-white transition duration-300">Consultations</a></li>
                <li><a href="#" className="text-primary-light hover:text-white transition duration-300">Emergency Care</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-primary-light mb-2">Email: info@healthbooking.com</p>
              <p className="text-primary-light mb-2">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-primary-light">
            <p>&copy; {new Date().getFullYear()} Health Booking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
