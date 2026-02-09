import ProfileForm from "../components/forms/ProfileForm";

export default function ProfilePage() {
  return (
    <div>
      <ProfileForm />
      <div className="absolute bottom-0 right-0 z-0 pointer-events-none">
        <img
          alt="Ilustración persona caminando"
          className="w-64 md:w-96 lg:max-w-md object-contain"
          src="/img/walking-man.png"
        />
      </div>
    </div>
  )
}
