import AppLayout from '@/layouts/AppLayout';
import DailyProgressReport from '@/components/DailyProgress';

export default function DailyProgressReportShow({ report, steps, cumulative }) {
    return (
        <DailyProgressReport
            screen="show"
            report={report}
            steps={steps}
            cumulative={cumulative}
        />
    );
}

DailyProgressReportShow.layout = AppLayout;
