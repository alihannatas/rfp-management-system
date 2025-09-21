import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DashboardData {
  projects: Array<{
    id: number;
    title: string;
    status: string;
    createdAt: string;
    budget?: number | string;
  }>;
  rfps: Array<{
    id: number;
    title: string;
    status: string;
    isActive: boolean;
    createdAt: string;
    proposals?: Array<{
      id: number;
      totalAmount?: number | string;
      status: string;
    }>;
  }>;
  proposals: Array<{
    id: number;
    status: string;
    totalAmount: number | string;
    submittedAt: string;
  }>;
}

interface DashboardChartsProps {
  data: DashboardData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function DashboardCharts({ data }: DashboardChartsProps) {
  // Proje durumu dağılımı
  const projectStatusData = data.projects.reduce((acc: any, project) => {
    const status = project.status;
    const existing = acc.find((item: any) => item.status === status);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ status, count: 1 });
    }
    return acc;
  }, []);

  // RFP durumu dağılımı
  const rfpStatusData = data.rfps.reduce((acc: any, rfp) => {
    const status = rfp.isActive ? 'Aktif' : 'Pasif';
    const existing = acc.find((item: any) => item.status === status);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ status, count: 1 });
    }
    return acc;
  }, []);

  // Teklif durumu dağılımı (şimdilik kullanılmıyor)
  // const proposalStatusData = data.proposals.reduce((acc: any, proposal) => {
  //   const status = proposal.status;
  //   const existing = acc.find((item: any) => item.status === status);
  //   if (existing) {
  //     existing.count += 1;
  //   } else {
  //     acc.push({ status, count: 1 });
  //   }
  //   return acc;
  // }, []);

  // Aylık proje oluşturma trendi
  const monthlyProjects = data.projects.reduce((acc: any, project) => {
    const month = new Date(project.createdAt).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' });
    const existing = acc.find((item: any) => item.month === month);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ month, count: 1 });
    }
    return acc;
  }, []).sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // RFP'lerdeki teklif sayısı
  const rfpProposalCount = data.rfps.map(rfp => ({
    name: rfp.title.length > 20 ? rfp.title.substring(0, 20) + '...' : rfp.title,
    proposals: rfp.proposals?.length || 0,
    status: rfp.isActive ? 'Aktif' : 'Pasif',
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Proje Durumu Dağılımı */}
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Proje Durumu Dağılımı</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={projectStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ status, count }) => `${status} (${count})`}
              outerRadius={60}
              fill="#8884d8"
              dataKey="count"
            >
              {projectStatusData.map((_: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* RFP Durumu Dağılımı */}
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">RFP Durumu Dağılımı</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={rfpStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Aylık Proje Trendi */}
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border md:col-span-2">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Aylık Proje Oluşturma Trendi</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyProjects}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RFP'lerdeki Teklif Sayısı */}
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border md:col-span-2">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">RFP'lerdeki Teklif Sayısı</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={rfpProposalCount}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              fontSize={10}
              interval={0}
            />
            <YAxis fontSize={10} />
            <Tooltip />
            <Bar dataKey="proposals" fill="#82CA9D" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
