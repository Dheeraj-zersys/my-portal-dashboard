import AppLayout from '@/layouts/AppLayout';
import DailyProgressReport from '@/components/DailyProgress';

export default function DailyProgressReportForm({ report, steps, options }) {
    return (
        <DailyProgressReport
            screen="form"
            report={report}
            steps={steps}
            options={options}
        />
    );
}

DailyProgressReportForm.layout = AppLayout;
