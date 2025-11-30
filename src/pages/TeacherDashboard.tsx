import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { Button } from "@/components/button";
import  {Input}  from "@/components/teachInput";
import { Badge } from "@/components/badge";
import { Switch } from "@/components/switch";
// removed unused Select imports
import { Users, Calendar, Save, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: number;
  name: string;
  attendance: boolean;
  absenceJustified: boolean;
  absenceReason: string;
  memorization: { pages: number; verses: string; section: string };
  review: { pages: number; verses: string; section: string };
  testScore: number;
  evaluation: string;
}

interface Session {
  id: string;
  date: string;
  halaqaId: string;
  students: Student[];
}

const TeacherDashboard = () => {
  const [selectedHalaqa, setSelectedHalaqa] = useState("halaqa1");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionStudents, setSessionStudents] = useState<Student[]>([]);

  const teacher = {
    name: "الأستاذ عبد الرحمن",
  };

  const halaqat = [
    { id: "halaqa1", name: "حلقة الفوج 1", students: 15 },
    { id: "halaqa2", name: "حلقة الفوج 2", students: 12 },
    { id: "halaqa3", name: "حلقة الإمام الخاصة", students: 8 },
  ];

  const sessions: Session[] = [
    {
      id: "session1",
      date: "2024-01-15",
      halaqaId: "halaqa1",
      students: [
        {
          id: 1,
          name: "محمد أحمد",
          attendance: true,
          absenceJustified: false,
          absenceReason: "",
          memorization: { pages: 1, verses: "1-7", section: "الحزب 1 - الربع 1" },
          review: { pages: 2, verses: "1-20", section: "الحزب 1 - الربع 2" },
          testScore: 9,
          evaluation: "ممتاز، حفظ متقن",
        },
        {
          id: 2,
          name: "فاطمة الزهراء",
          attendance: true,
          absenceJustified: false,
          absenceReason: "",
          memorization: { pages: 1, verses: "8-15", section: "الحزب 1 - الربع 1" },
          review: { pages: 1, verses: "1-10", section: "الحزب 1 - الربع 1" },
          testScore: 10,
          evaluation: "ممتازة جداً",
        },
        {
          id: 3,
          name: "عمر خالد",
          attendance: false,
          absenceJustified: true,
          absenceReason: "مرض",
          memorization: { pages: 0, verses: "", section: "" },
          review: { pages: 0, verses: "", section: "" },
          testScore: 0,
          evaluation: "",
        },
      ],
    },
    {
      id: "session2",
      date: "2024-01-14",
      halaqaId: "halaqa1",
      students: [
        {
          id: 1,
          name: "محمد أحمد",
          attendance: true,
          absenceJustified: false,
          absenceReason: "",
          memorization: { pages: 1, verses: "8-14", section: "الحزب 1 - الربع 1" },
          review: { pages: 1, verses: "1-7", section: "الحزب 1 - الربع 1" },
          testScore: 8,
          evaluation: "جيد جداً",
        },
        {
          id: 2,
          name: "فاطمة الزهراء",
          attendance: true,
          absenceJustified: false,
          absenceReason: "",
          memorization: { pages: 1, verses: "1-7", section: "الحزب 1 - الربع 1" },
          review: { pages: 2, verses: "1-15", section: "الحزب 1 - الربع 1" },
          testScore: 9,
          evaluation: "ممتازة",
        },
        {
          id: 3,
          name: "عمر خالد",
          attendance: true,
          absenceJustified: false,
          absenceReason: "",
          memorization: { pages: 1, verses: "1-7", section: "الحزب 1 - الربع 1" },
          review: { pages: 1, verses: "1-10", section: "الحزب 1 - الربع 1" },
          testScore: 7,
          evaluation: "جيد",
        },
      ],
    },
  ];

  const filteredSessions = sessions.filter((s) => s.halaqaId === selectedHalaqa);

  const handleSessionClick = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setSelectedSession(sessionId);
      setSessionStudents(session.students);
    }
  };

  const handleBackToSessions = () => {
    setSelectedSession(null);
    setSessionStudents([]);
  };

  const handleAttendanceToggle = (studentId: number, isPresent: boolean) => {
    setSessionStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendance: isPresent } : s))
    );
  };

  const handleSave = () => {
    toast.success("تم حفظ التغييرات بنجاح", {
      description: "تم تحديث سجلات الطلاب",
    });
  };

  return (
    <div className="min-h-screen bg-secondary/20 py-8 px-4" dir="rtl">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <Card className="mb-8 shadow-elevated border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-accent">
                  <AvatarFallback className="text-xl bg-accent text-white">
                    {teacher.name.split(" ")[1]?.charAt(0) || "أ"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl font-bold text-primary arabic-text">
                    {teacher.name}
                  </CardTitle>
                  <p className="text-muted-foreground arabic-text">معلم القرآن الكريم</p>
                </div>
              </div>
              <a href="/" className="text-sm text-primary hover:underline arabic-text">الصفحة الرئيسية</a>
            </div>
          </CardHeader>
        </Card>

        {/* Halaqat Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6 arabic-text">الحلقات المسندة</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {halaqat.map((halaqa) => (
              <Card
                key={halaqa.id}
                className={`cursor-pointer shadow-card hover:shadow-elevated transition-all ${
                  selectedHalaqa === halaqa.id ? "border-2 border-primary bg-primary-light" : ""
                }`}
                onClick={() => setSelectedHalaqa(halaqa.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <span className="arabic-text">{halaqa.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground arabic-text">عدد الطلاب</span>
                    <Badge variant="secondary" className="text-lg">
                      {halaqa.students}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sessions List or Session Detail */}
        <Card className="shadow-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              {selectedSession ? (
                <Button variant="ghost" onClick={handleBackToSessions} className="gap-2">
                  <ChevronLeft className="h-5 w-5" />
                  <span className="arabic-text">العودة للجلسات</span>
                </Button>
              ) : (
                <CardTitle className="text-2xl text-primary arabic-text">
                  الجلسات - {halaqat.find((h) => h.id === selectedHalaqa)?.name}
                </CardTitle>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedSession ? (
              // Sessions List
              <div className="space-y-3">
                {filteredSessions.map((session) => (
                  <Card
                    key={session.id}
                    className="cursor-pointer shadow-card hover:shadow-elevated transition-all border-r-4 border-r-primary"
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-bold text-lg arabic-text">
                              جلسة {new Date(session.date).toLocaleDateString("ar-EG", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground arabic-text">
                              {session.students.length} طالب
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-lg">
                          {session.students.filter((s) => s.attendance).length} حاضر
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // Session Detail - Students List
              <div className="space-y-4">
                {sessionStudents.map((student) => (
                  <Card key={student.id} className="shadow-card border-r-4 border-r-accent">
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        {/* Student Header with Attendance Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-primary">
                              <AvatarFallback className="bg-primary text-white">
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-lg arabic-text">{student.name}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm text-muted-foreground arabic-text">الحضور:</span>
                                <Switch
                                  checked={student.attendance}
                                  onCheckedChange={(checked) => handleAttendanceToggle(student.id, checked)}
                                />
                                <Badge variant={student.attendance ? "default" : "destructive"}>
                                  {student.attendance ? "حاضر" : "غائب"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Absence Reason */}
                        {!student.attendance && (
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground arabic-text">
                              سبب الغياب {student.absenceJustified && "(مبرر)"}
                            </label>
                            <Input
                              defaultValue={student.absenceReason}
                              placeholder="اكتب سبب الغياب..."
                              className="arabic-text"
                            />
                          </div>
                        )}

                        {/* Session Details Grid */}
                        {student.attendance && (
                          <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Memorization */}
                              <div className="space-y-3">
                                <p className="text-sm font-semibold text-primary arabic-text">الحفظ الجديد</p>
                                <div className="space-y-2">
                                  <Input
                                    placeholder="عدد الصفحات"
                                    defaultValue={student.memorization.pages}
                                    type="number"
                                  />
                                  <Input placeholder="الآيات" defaultValue={student.memorization.verses} />
                                  <Input placeholder="الحزب/الربع" defaultValue={student.memorization.section} />
                                </div>
                              </div>

                              {/* Review */}
                              <div className="space-y-3">
                                <p className="text-sm font-semibold text-accent arabic-text">المراجعة</p>
                                <div className="space-y-2">
                                  <Input placeholder="عدد الصفحات" defaultValue={student.review.pages} type="number" />
                                  <Input placeholder="الآيات" defaultValue={student.review.verses} />
                                  <Input placeholder="الحزب/الربع" defaultValue={student.review.section} />
                                </div>
                              </div>
                            </div>

                            {/* Test Score and Evaluation */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <p className="text-sm font-semibold text-muted-foreground arabic-text">نتيجة الاختبار</p>
                                <div className="space-y-2">
                                  <Input placeholder="الدرجة" defaultValue={student.testScore} type="number" max="10" />
                                  <span className="text-sm text-muted-foreground">من 10</span>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <p className="text-sm font-semibold text-muted-foreground arabic-text">التقييم</p>
                                <Input placeholder="ملاحظات وتقييم الأستاذ..." defaultValue={student.evaluation} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="mt-8 flex justify-center">
                  <Button size="lg" onClick={handleSave} className="shadow-elevated">
                    <Save className="h-5 w-5 ml-2" />
                    <span className="arabic-text">حفظ جميع التغييرات</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
