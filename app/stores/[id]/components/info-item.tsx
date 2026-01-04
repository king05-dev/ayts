interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

export function InfoItem({ 
  icon, 
  label, 
  value 
}: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
