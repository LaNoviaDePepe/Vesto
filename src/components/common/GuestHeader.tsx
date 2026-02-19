import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from "react-i18next";

export default function GuestHeader() {
    // Constante que almacena los links para los usuarios anónimos
    const { t } = useTranslation();
    const guestLinks = [
        { label: t('navbar.links.home'), path: '/' },
        { label: t('navbar.links.behaviour'), path: '/#funcionamiento' },
        { label: t('navbar.links.reviews'), path: '/#reviews' },
        { label: t('navbar.links.team'), path: '/#equipo' },
    ];


    return (
        <header className="bg-auxiliary-700 ">
            <div className="logo">
                <Link to="/">
                    <img src="/img/black-logo.png" alt="Logo de Vesto" className="h-15 w-auto" />
                </Link>
            </div>
            <div className='flex gap-3'>
                <Navbar links={guestLinks} />

                <div className='flex items-center gap-2'>
                    <Link to="/login"><Button variant='primary'>{t('navbar.button.login')}</Button></Link>
                    <Link to="/signup"><Button variant='auxiliar'>{t('navbar.button.signup')}</Button></Link>
                </div>
                <LanguageSwitcher />
            </div>
        </header>
    );
}