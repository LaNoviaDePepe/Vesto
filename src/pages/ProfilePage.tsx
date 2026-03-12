import { useTranslation } from "react-i18next";
import ProfileForm from "../components/forms/ProfileForm";

export default function ProfilePage() {
    const { t } = useTranslation();

  return (
    <div>
      <ProfileForm />
      <div className="absolute bottom-0 right-0 z-0 pointer-events-none">
        <img
          alt={t('profile.walking_man_alt')}
          className="w-64 md:w-96 lg:max-w-md object-contain"
          src="/img/walking-man.png"
        />
      </div>
    </div>
  )
}
