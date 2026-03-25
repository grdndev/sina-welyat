import Layout from '../../components/Layout';

import background from '../../assets/bg/homePage.png';
import backgroundx from '../../assets/img/contact.jpg';
import Field from '../../components/Field';
import Textarea from '../../components/Textera';
import Button from '../../components/Button';
import {
    MapPin,
    Phone,
    Mail
} from  'lucide-react';

export default function Contact() {
  return (
    <Layout>
      <h1 className="text-text-primary text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-center">
        Contact
      </h1>

      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="">
          <img src={backgroundx} className="rounded-xl" height={500} width={500} alt="" />
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-5 rounded-xl">
          <h2 className="font-semibold text-2xl">Send us a message</h2>
          <p className="m-2 text-base">
            Your satisfaction comes first. We strive to deliver exceptional service, quality, and
            support to ensure the best experience possible.
          </p>
          <form
            action="
            "
          >
            <div className="mt-10 flex flex-col gap-5">
              <Field title="Your name" name="name" required placeholder="John" />
              <Field
                title="Email"
                name="email"
                type="email"
                required
                placeholder="John@gmail.com"
              />
              <Textarea title="Description" name="description" required placeholder="Message" />
              <Button name="send" typeBtn="submit" className="mt-10" />
            </div>
          </form>
        </div>

        <div className="col-span-2 grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-5 rounded-xl  p-2 text-center">
            <div className='m-4 flex flex-col justify-center items-center'>
                <div className='bg-white/10 backdrop-blur-md border border-white/20 shadow-lg size-16 rounded-xl flex justify-center items-center'>
                <MapPin color="#ee9d07" size={30} /></div>
                <div className='mt-2'><strong>Address</strong></div>
                <div className='text-text-secondary'>785 avenue de l'alverne</div>
            </div>

            <div className='m-4 flex flex-col justify-center items-center'>
                <div className='bg-white/10 backdrop-blur-md border border-white/20 shadow-lg size-16 rounded-xl flex justify-center items-center'>
                <Phone color="#22A854" size={30} /></div>
                <div className='mt-2'><strong>Contact</strong></div>
                <div className='text-text-secondary'>0262 01 32 12</div>
            </div>

            <div className='m-4 flex flex-col justify-center items-center'>
                <div className='bg-white/10 backdrop-blur-md border border-white/20 shadow-lg size-16 rounded-xl flex justify-center items-center'>
                <Mail color="#3BA9C3" size={30} /></div>
                <div className='mt-2'><strong>Email</strong></div>
                <div className='text-text-secondary'>John@gmail.com</div>
            </div>

        </div>


      </div>
    </Layout>
  );
}
