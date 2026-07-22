const AdminHeader = ({ title }: { title: string }) => {
    return (
        <div className="bg-background border-b border-border px-4 md:px-8 py-5 hidden md:block">
            <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
        </div>
    )
}
export default AdminHeader
