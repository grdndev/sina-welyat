import type React from "react";

interface HealthDependentBackgroundProps extends React.PropsWithChildren {
    className?: string;
    value: number;
    tiers: number[];
    reverse?: boolean;
}

const background = [
    'bg-radial-[at_50%_150%] from-emerald-600/60 to-transparent to-60%',
    'bg-radial-[at_50%_150%] from-yellow-600/60 to-transparent to-60%',
    'bg-radial-[at_50%_150%] from-red-600/60 to-transparent to-60%',
];

export default function HealthDependentBackground(props: HealthDependentBackgroundProps) {
    var i = 0;
    for(let tier of props.tiers) {
        const isTier = props.reverse ? props.value > tier : props.value <= tier
        if (!isTier) break;
        i++;
    }

    return <div className={`${props.className ?? ''} ${background[i]}`}>
        {props.children}
    </div>
}