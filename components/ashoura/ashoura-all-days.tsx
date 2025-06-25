export default function AshouraAllDays({ ihyaaId }: { ihyaaId: number }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl">أيام الإحياء</h2>
            <p>هذه الصفحة تعرض الأيام الخاصة بإحياء عاشوراء.</p>
            <p>{ihyaaId}</p>
            {/* هنا يمكنك إضافة المزيد من التفاصيل أو المكونات المتعلقة بأيام الإحياء */}
        </div>
    );
}