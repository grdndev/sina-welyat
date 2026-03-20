type HealthIndicatorProps = {
    value: number;
    tiers: number[];
    message: string[];
    bgColor?: boolean;
    textColor?: boolean;
    reverse?: boolean;
}
const background = [
    'bg-green-300',
    'bg-orange-300',
    'bg-red-300',
];
const chip = [
    'bg-green-400',
    'bg-orange-400',
    'bg-red-400',
]
const text = [
    'text-green-400',
    'text-orange-400',
    'text-red-400',
]

export default function HealthIndicator(props: HealthIndicatorProps) {
    var i = 0;
    for(let tier of props.tiers) {
        const isTier = props.reverse ? props.value > tier : props.value <= tier
        if (!isTier) break;
        i++;
    }

    return <div className={`flex items-center rounded-full w-fit px-2 text-gray-700 ${props.bgColor ? background[i] : ''}`}>
        <div className={`h-2 w-2 rounded-full ${chip[i]} mr-2`} />
        <div className={props.textColor ? text[i] : ''}>{props.message[i]}</div>
    </div>
}