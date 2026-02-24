import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LogOut } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { authService } from "../services/authService";
import { feedbackService } from "../services/feedbackService";

const COLORS = [
  "#4f46e5",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);

  // ✅ LOAD DATA ONLY ONCE
  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;
    }

    const stored = feedbackService.getAllFeedbacks();
    setFeedbacks(stored || []);
  }, []);

  // ✅ LOGOUT FUNCTION (FIXED)
  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  // ✅ DYNAMIC ANALYTICS
  const analytics = useMemo(() => {
    const totalFeedbacks = feedbacks.length;

    const averageRating =
      totalFeedbacks > 0
        ? (
            feedbacks.reduce((sum, fb) => sum + fb.rating, 0) /
            totalFeedbacks
          ).toFixed(1)
        : 0;

    const responseRate = totalFeedbacks > 0 ? 100 : 0;

    // Category Breakdown
    const categoryMap = {};
    feedbacks.forEach((fb) => {
      const categoryName = fb.category || fb.targetName || "General";

      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = { count: 0, totalRating: 0 };
      }

      categoryMap[categoryName].count += 1;
      categoryMap[categoryName].totalRating += fb.rating;
    });

    const categoryBreakdown = Object.keys(categoryMap).map((key) => ({
      category: key,
      count: categoryMap[key].count,
      avgRating: (
        categoryMap[key].totalRating / categoryMap[key].count
      ).toFixed(1),
    }));

    // Monthly Trend
    const monthMap = {};
    feedbacks.forEach((fb) => {
      const month = new Date(fb.timestamp).toLocaleString("default", {
        month: "short",
      });

      if (!monthMap[month]) {
        monthMap[month] = { month, feedbacks: 0, totalRating: 0 };
      }

      monthMap[month].feedbacks += 1;
      monthMap[month].totalRating += fb.rating;
    });

    const trendData = Object.values(monthMap).map((m) => ({
      month: m.month,
      feedbacks: m.feedbacks,
      avgRating: (m.totalRating / m.feedbacks).toFixed(1),
    }));

    return {
      totalFeedbacks,
      averageRating,
      responseRate,
      categoryBreakdown,
      trendData,
    };
  }, [feedbacks]);

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Total Feedbacks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics.totalFeedbacks}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Average Rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics.averageRating}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Response Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics.responseRate}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Active Students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="feedbacks">Recent Feedbacks</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview">

            <Card>
              <CardHeader>
                <CardTitle>Feedback Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="feedbacks" stroke="#4f46e5" />
                    <Line yAxisId="right" type="monotone" dataKey="avgRating" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              <Card>
                <CardHeader>
                  <CardTitle>Feedback by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.categoryBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={analytics.categoryBreakdown}
      dataKey="count"
      nameKey="category"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {analytics.categoryBreakdown.map((_, index) => (
        <Cell
          key={index}
          fill={COLORS[index % COLORS.length]}
        />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* RECENT FEEDBACKS */}
          <TabsContent value="feedbacks">
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedbacks</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks.slice(-50).reverse().map((fb) => (
                      <TableRow key={fb.id}>
                        <TableCell>{formatDate(fb.timestamp)}</TableCell>
                        <TableCell>
                          <Badge>{fb.category}</Badge>
                        </TableCell>
                        <TableCell>{fb.rating}/5</TableCell>
                        <TableCell className="truncate max-w-md">
                          {fb.comments}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BY CATEGORY */}
          <TabsContent value="categories">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics.categoryBreakdown.map((cat, index) => (
                <Card key={cat.category}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {cat.category}
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                    </CardTitle>
                    <CardDescription>Performance Metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>Total Feedbacks: {cat.count}</div>
                    <div>Average Rating: {cat.avgRating}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
}