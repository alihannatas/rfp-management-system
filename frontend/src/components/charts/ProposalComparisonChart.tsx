import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ProposalData {
  id: number;
  supplier?: {
    firstName: string;
    lastName: string;
    company?: string;
  };
  totalAmount?: number | string;
  status: string;
  submittedAt: string;
}

interface ProposalComparisonChartProps {
  proposals: ProposalData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ProposalComparisonChart({ proposals }: ProposalComparisonChartProps) {
  if (!proposals || proposals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Karşılaştırma için yeterli teklif bulunmuyor.
      </div>
    );
  }

  // Bar chart için veri hazırla
  const barData = proposals.map(proposal => ({
    name: proposal.supplier ? `${proposal.supplier.firstName} ${proposal.supplier.lastName}` : 'Bilinmeyen',
    amount: proposal.totalAmount ? (typeof proposal.totalAmount === 'string' ? parseFloat(proposal.totalAmount) : proposal.totalAmount) : 0,
    company: proposal.supplier?.company || 'Bilinmeyen',
    status: proposal.status,
  }));

  // Pie chart için veri hazırla
  const pieData = proposals.map((proposal, index) => ({
    name: proposal.supplier ? `${proposal.supplier.firstName} ${proposal.supplier.lastName}` : 'Bilinmeyen',
    value: proposal.totalAmount ? (typeof proposal.totalAmount === 'string' ? parseFloat(proposal.totalAmount) : proposal.totalAmount) : 0,
    color: COLORS[index % COLORS.length],
  }));

  // En düşük ve en yüksek teklifleri bul
  const amounts = proposals.map(p => p.totalAmount ? (typeof p.totalAmount === 'string' ? parseFloat(p.totalAmount) : p.totalAmount) : 0);
  const minAmount = Math.min(...amounts);
  const maxAmount = Math.max(...amounts);
  const avgAmount = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Özet İstatistikler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
          <h3 className="text-xs sm:text-sm font-medium text-green-800">En Düşük Teklif</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            }).format(minAmount)}
          </p>
        </div>
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
          <h3 className="text-xs sm:text-sm font-medium text-blue-800">Ortalama Teklif</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            }).format(avgAmount)}
          </p>
        </div>
        <div className="bg-red-50 p-3 sm:p-4 rounded-lg sm:col-span-2 lg:col-span-1">
          <h3 className="text-xs sm:text-sm font-medium text-red-800">En Yüksek Teklif</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            }).format(maxAmount)}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Teklif Tutarları Karşılaştırması</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              fontSize={10}
              interval={0}
            />
            <YAxis 
              tickFormatter={(value) => new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)}
              fontSize={10}
            />
            <Tooltip 
              formatter={(value: number) => [
                new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                }).format(value),
                'Tutar'
              ]}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `${payload[0].payload.company} - ${label}`;
                }
                return label;
              }}
            />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Teklif Dağılımı</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [
                new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                }).format(value),
                'Tutar'
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
