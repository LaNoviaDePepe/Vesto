import { useInView } from '../../hooks/useInView';

export default function AnimatedCard({ children, className, id, delay = 0 }: {
    children: React.ReactNode;
    className?: string;
    id?: string;
    delay?: number;
}) {
    const { ref, inView } = useInView();

    return (
        <div
            ref={ref}
            id={id}
            className={`card-hidden ${inView ? 'animate-fadeUp' : ''} ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
