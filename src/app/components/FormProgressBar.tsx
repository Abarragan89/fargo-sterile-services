import { Line } from 'rc-progress';

export default function FormProgressBar({ progress }: { progress: number }) {
    return (
        <div className='mt-10 max-w-[900px] mr-5 ml-5'>
            <div className="flex justify-between items-end w-[100%] mx-auto mx-auto text-[.8rem] text-[var(--off-black)] text-center leading-none mb-1 opacity-85">
                <p>Facility <br /> Information</p>
                <p>Terms & <br />  Conditions</p>
                <p>Payment & <br /> Contacts</p>
                <p>Credit <br />Application</p>
                <p>Document <br /> Uploads</p>
                <p>Review <br /> Information</p>
            </div>
            <Line
                percent={progress}
                strokeWidth={1}
                trailWidth={1}
                strokeColor="rgb(212, 70, 55)"
                trailColor="rgb(156, 158, 159)"
                className="w-[100%] mx-auto mb-10"
            />
        </div>
    )
}
