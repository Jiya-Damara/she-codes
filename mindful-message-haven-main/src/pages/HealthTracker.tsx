import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowRightIcon, 
  CalendarIcon, 
  ClockIcon, 
  DropletIcon, 
  ThermometerIcon 
} from "lucide-react";
import { toast } from "sonner";

export default function HealthTracker() {
  // State management
  const [date, setDate] = useState(new Date());
  const [cycleData, setCycleData] = useState({
    currentPhase: "Follicular",
    currentDay: 8,
    cycleLength: 28,
    lastPeriod: new Date("2024-03-18"),
    nextPeriod: new Date("2024-04-15"),
    ovulation: new Date("2024-04-01")
  });
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState({
    category: "physical",
    type: "cramps",
    intensity: "moderate",
    date: new Date()
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage();
  }, [cycleData, symptoms]);

  // Load data from localStorage
  const loadFromLocalStorage = () => {
    try {
      // Load cycle data
      const savedCycleData = localStorage.getItem('cycleData');
      if (savedCycleData) {
        const parsedData = JSON.parse(savedCycleData);
        
        // Convert string dates back to Date objects
        parsedData.lastPeriod = new Date(parsedData.lastPeriod);
        parsedData.nextPeriod = new Date(parsedData.nextPeriod);
        parsedData.ovulation = new Date(parsedData.ovulation);
        
        setCycleData(parsedData);
      }
      
      // Load symptoms
      const savedSymptoms = localStorage.getItem('symptoms');
      if (savedSymptoms) {
        const parsedSymptoms = JSON.parse(savedSymptoms);
        
        // Convert string dates back to Date objects
        parsedSymptoms.forEach(symptom => {
          symptom.date = new Date(symptom.date);
        });
        
        setSymptoms(parsedSymptoms);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast.error("Failed to load your saved data");
    }
  };

  // Save data to localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('cycleData', JSON.stringify(cycleData));
      localStorage.setItem('symptoms', JSON.stringify(symptoms));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      toast.error("Failed to save your data");
    }
  };

  // Handle logging a new symptom
  const handleLogSymptom = () => {
    const symptomToLog = {
      ...newSymptom,
      id: Date.now(), // Create a unique ID for each symptom
      date: date // Use the selected date
    };
    
    setSymptoms(prevSymptoms => [symptomToLog, ...prevSymptoms]);
    toast.success("Symptom logged successfully!");
  };

  // Handle symptom input changes
  const handleSymptomChange = (field, value) => {
    setNewSymptom(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate days until next period
  const daysUntilNextPeriod = () => {
    const today = new Date();
    const nextPeriod = new Date(cycleData.nextPeriod);
    const diffTime = Math.abs(nextPeriod.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Delete a symptom
  const deleteSymptom = (id) => {
    setSymptoms(prevSymptoms => prevSymptoms.filter(symptom => symptom.id !== id));
    toast.info("Symptom deleted");
  };

  // Update cycle data after period logging
  const logPeriod = (startDate) => {
    // Calculate new cycle data based on the logged period start date
    const newStartDate = new Date(startDate);
    const newOvulation = new Date(newStartDate);
    newOvulation.setDate(newStartDate.getDate() + 14); // Typically ~14 days after period start
    
    const newNextPeriod = new Date(newStartDate);
    newNextPeriod.setDate(newStartDate.getDate() + cycleData.cycleLength);
    
    setCycleData(prev => ({
      ...prev,
      lastPeriod: newStartDate,
      ovulation: newOvulation,
      nextPeriod: newNextPeriod,
      currentPhase: "Menstrual",
      currentDay: 1
    }));
    
    toast.success("Period logged successfully!");
  };

  // Handle date selection
  const handleDateSelect = (newDate) => {
    setDate(newDate);
    setNewSymptom(prev => ({
      ...prev,
      date: newDate
    }));
  };

// Add this function before the return statement in your component
const getDayStyle = (day) => {
  // Convert both dates to start of day for comparison
  const dayDate = new Date(day);
  dayDate.setHours(0, 0, 0, 0);
  
  // For period days (typically 5 days from period start)
  const periodStart = new Date(cycleData.lastPeriod);
  periodStart.setHours(0, 0, 0, 0);
  const periodEnd = new Date(periodStart);
  periodEnd.setDate(periodStart.getDate() + 5);
  
  // For ovulation (typically day 14)
  const ovulationDate = new Date(cycleData.ovulation);
  ovulationDate.setHours(0, 0, 0, 0);
  
  // For fertile window (typically 5 days before ovulation plus ovulation day)
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(ovulationDate.getDate() - 5);
  
  // For PMS symptoms (typically 7 days before period)
  const pmsStart = new Date(cycleData.nextPeriod);
  pmsStart.setDate(pmsStart.getDate() - 7);
  const pmsEnd = new Date(cycleData.nextPeriod);
  pmsEnd.setDate(pmsEnd.getDate() - 1);
  
  if (dayDate >= periodStart && dayDate <= periodEnd) {
    return "bg-brand/30 text-brand-foreground rounded-full";
  } else if (dayDate.getTime() === ovulationDate.getTime()) {
    return "bg-blue-400/30 text-blue-700 rounded-full";
  } else if (dayDate >= fertileStart && dayDate <= ovulationDate) {
    return "bg-yellow-400/30 text-yellow-700 rounded-full";
  } else if (dayDate >= pmsStart && dayDate <= pmsEnd) {
    return "bg-purple-400/30 text-purple-700 rounded-full";
  }
  
  return "";
};

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Cycle & Wellness Tracker</h1>
          <p className="text-xl text-muted-foreground">
            Monitor your health patterns and receive personalized insights
          </p>
        </div>
        
        <Tabs defaultValue="cycle" className="w-full animate-slideUp">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
            <TabsTrigger value="cycle">Cycle Tracker</TabsTrigger>
            <TabsTrigger value="symptoms">Symptom Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cycle" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 border border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                <Calendar
  mode="single"
  selected={date}
  onSelect={handleDateSelect}
  className="rounded-md border"
  modifiersClassNames={{
    selected: "bg-brand text-white hover:bg-brand hover:text-white focus:bg-brand focus:text-white"
  }}
  modifiers={{
    customStyles: (day) => true
  }}
  modifiersStyles={{
    customStyles: (day) => {
      return { className: getDayStyle(day) };
    }
  }}
/>
                  
                  {/* <div className="mt-6 space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-brand mr-2"></div>
                      <span className="text-sm">Period</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-400 mr-2"></div>
                      <span className="text-sm">Ovulation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
                      <span className="text-sm">Fertile Window</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-purple-400 mr-2"></div>
                      <span className="text-sm">PMS Symptoms</span>
                    </div>
                  </div> */}
                  
                  <div className="mt-6">
                    <Button 
                      className="w-full"
                      onClick={() => logPeriod(date)}
                    >
                      Log Period Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 border border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Cycle Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">Current Phase</div>
                        <CalendarIcon className="h-4 w-4 text-brand" />
                      </div>
                      <div className="text-2xl font-semibold mb-1">{cycleData.currentPhase}</div>
                      <div className="text-sm text-muted-foreground">Day {cycleData.currentDay} of {cycleData.cycleLength}</div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">Next Period</div>
                        <DropletIcon className="h-4 w-4 text-brand" />
                      </div>
                      <div className="text-2xl font-semibold mb-1">In {daysUntilNextPeriod()} days</div>
                      <div className="text-sm text-muted-foreground">{formatDate(cycleData.nextPeriod)}</div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">Avg. Cycle Length</div>
                        <ClockIcon className="h-4 w-4 text-brand" />
                      </div>
                      <div className="text-2xl font-semibold mb-1">{cycleData.cycleLength} days</div>
                      <div className="text-sm text-muted-foreground">Regular cycle</div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium mb-4">Cycle Prediction Timeline</h3>
                    
                    <div className="relative">
                      <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-muted"></div>
                      
                      <div className="relative pl-10 pb-6">
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white">
                          <DropletIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Last Period</h4>
                          <p className="text-sm text-muted-foreground">{formatDate(cycleData.lastPeriod)}</p>
                        </div>
                      </div>
                      
                      <div className="relative pl-10 pb-6">
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                          <ThermometerIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Ovulation</h4>
                          <p className="text-sm text-muted-foreground">{formatDate(cycleData.ovulation)}</p>
                        </div>
                      </div>
                      
                      <div className="relative pl-10">
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white">
                          <DropletIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Next Period</h4>
                          <p className="text-sm text-muted-foreground">{formatDate(cycleData.nextPeriod)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="symptoms" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4">
                <Card className="border border-border/40 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Log Symptoms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Date</label>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>{date ? date.toLocaleDateString() : "Select a date"}</span>
                        </Button>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Symptom Category</label>
                        <Select 
                          value={newSymptom.category}
                          onValueChange={(value) => handleSymptomChange('category', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="physical">Physical</SelectItem>
                            <SelectItem value="emotional">Emotional</SelectItem>
                            <SelectItem value="sleep">Sleep</SelectItem>
                            <SelectItem value="energy">Energy</SelectItem>
                            <SelectItem value="digestive">Digestive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Specific Symptom</label>
                        <Select 
                          value={newSymptom.type}
                          onValueChange={(value) => handleSymptomChange('type', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select symptom" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cramps">Cramps</SelectItem>
                            <SelectItem value="headache">Headache</SelectItem>
                            <SelectItem value="bloating">Bloating</SelectItem>
                            <SelectItem value="fatigue">Fatigue</SelectItem>
                            <SelectItem value="mood-swings">Mood Swings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Intensity</label>
                        <Select 
                          value={newSymptom.intensity}
                          onValueChange={(value) => handleSymptomChange('intensity', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select intensity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button className="w-full bg-brand hover:bg-brand-600 text-white" onClick={handleLogSymptom}>
                        Log Symptom
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-8">
                <Card className="border border-border/40 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Recent Symptoms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {symptoms.length > 0 ? (
                        symptoms.map((symptom) => (
                          <div key={symptom.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium capitalize">{symptom.type.replace('-', ' ')}</h4>
                                <p className="text-sm text-muted-foreground capitalize">{symptom.intensity} intensity</p>
                                <p className="text-xs text-muted-foreground capitalize">Category: {symptom.category}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="text-sm text-muted-foreground">
                                  {new Date(symptom.date).toLocaleDateString()}
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="mt-2 text-red-500 hover:text-red-700"
                                  onClick={() => deleteSymptom(symptom.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-6">
                          <p className="text-muted-foreground">No symptoms logged yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}