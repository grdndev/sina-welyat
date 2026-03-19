type HealthIndicatorProps = {
    value: number;
    tiers: number[];
    data: {
        color: string;
        message: string;
    }[];
    bgColor?: boolean;
    textColor?: boolean;
    sortAsc?: boolean;
}

export default function HealthIndicator(props: HealthIndicatorProps) {
    var i = 0;
    for(let tier of props.tiers) {
        const isTier = props.sortAsc ? props.value > tier : props.value <= tier
        if (!isTier) break;
        i++;
    }

    return <div className={`flex items-center rounded-full w-fit px-2 text-gray-700 ${props.bgColor ?  `bg-${props.data[i].color}-300` : ''}`}>
        <div className={`h-2 w-2 rounded-full bg-${props.data[i].color}-400 mr-2`} />
        <div className={props.textColor ? `text-${props.data[i].color}-400` : ''}>{props.data[i].message}</div>
    </div>
}