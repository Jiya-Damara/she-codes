import AppLayout from "@/components/layout/AppLayout";
import { DiscussionCard } from "@/components/ui/discussion-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FilterIcon } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function Community() {
  const [postContent, setPostContent] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [discussions, setDiscussions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [activeRoom, setActiveRoom] = useState("PCOS Support");
  
  const topics = [
    "All Topics",
    "PCOS",
    "Cancer",
    "Menstrual Health",
    "Reproductive Health",
    "Mental Health",
    "Nutrition",
    "Fitness",
    "Self-Defense"
  ];
  
  const initialDiscussions = [
    {
      id: 1,
      author: "Priya S.",
      timeAgo: "2 hours ago",
      content: "Just got my PCOS diagnosis confirmed. Looking for advice on managing symptoms naturally. Has anyone tried dietary changes that actually helped?",
      likes: 24,
      replies: 8,
      tag: "PCOS"
    },
    {
      id: 2,
      author: "Anjali R.",
      timeAgo: "5 hours ago",
      content: "I've been experiencing intense period pain for the last few months. Has anyone found relief through yoga or specific exercises?",
      likes: 18,
      replies: 12,
      tag: "Menstrual Health"
    },
    {
      id: 3,
      author: "Meera K.",
      timeAgo: "1 day ago",
      content: "Starting therapy next week for postpartum depression. Really nervous but hopeful. Any advice for first-time therapy sessions?",
      likes: 35,
      replies: 14,
      tag: "Mental Health"
    }
  ];
  
  const initialChatMessages = [
    {
      id: 1,
      room: "PCOS Support",
      author: "Priya S.",
      initials: "PS",
      content: "Hi everyone! I was just diagnosed with PCOS last week. I'm feeling a bit overwhelmed with all the information. Has anyone tried inositol supplements?",
      timestamp: "10:30 AM",
      isCurrentUser: false
    },
    {
      id: 2,
      room: "PCOS Support",
      author: "You",
      initials: "You",
      content: "I've been taking inositol for about 3 months now. It's helped regulate my cycle a bit, but I've found that diet changes made the biggest difference for me.",
      timestamp: "10:32 AM",
      isCurrentUser: true
    },
    {
      id: 3,
      room: "PCOS Support",
      author: "Meera K.",
      initials: "MK",
      content: "I agree with the diet changes. Low carb and anti-inflammatory foods made a huge difference for me. My acne cleared up and my periods became more regular.",
      timestamp: "10:35 AM",
      isCurrentUser: false
    },
    {
      id: 4,
      room: "PCOS Support",
      author: "Anjali R.",
      initials: "AR",
      content: "Hi @Priya S., welcome to the group! In addition to what others have said, I found that stress management through yoga and meditation helped a lot with my symptoms.",
      timestamp: "10:38 AM",
      isCurrentUser: false
    },
    {
      id: 5,
      room: "PCOS Support",
      author: "Priya S.",
      initials: "PS",
      content: "Thank you all for the suggestions! I'll definitely look into diet changes and stress management techniques. This is really helpful!",
      timestamp: "10:40 AM",
      isCurrentUser: false
    }
  ];
  
  const activeDiscussions = [
    { title: "Managing PCOS symptoms naturally", participants: 32 },
    { title: "Endometriosis pain relief techniques", participants: 18 },
    { title: "Postpartum depression support group", participants: 24 }
  ];
  
  const resources = [
    "Understanding PCOS: A Comprehensive Guide",
    "Breast Self-Examination Techniques",
    "Mental Health Resources for Women",
    "Nutrition Guide for Hormonal Balance"
  ];

  const chatRooms = [
    "PCOS Support",
    "Menstrual Health",
    "Mental Wellness",
    "Nutrition & Diet",
    "Pregnancy & Postpartum",
    "General Discussion"
  ];
  
  // Load data from localStorage on component mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);
  
  // Load data from localStorage
  const loadFromLocalStorage = () => {
    try {
      // Load discussions
      const savedDiscussions = localStorage.getItem('communityDiscussions');
      if (savedDiscussions) {
        setDiscussions(JSON.parse(savedDiscussions));
      } else {
        setDiscussions(initialDiscussions);
      }
      
      // Load chat messages
      const savedChatMessages = localStorage.getItem('communityChatMessages');
      if (savedChatMessages) {
        setChatMessages(JSON.parse(savedChatMessages));
      } else {
        setChatMessages(initialChatMessages);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast.error("Failed to load community data");
      
      // Fallback to initial data
      setDiscussions(initialDiscussions);
      setChatMessages(initialChatMessages);
    }
  };
  
  // Save data to localStorage
  const saveToLocalStorage = (newDiscussions, newChatMessages) => {
    try {
      localStorage.setItem('communityDiscussions', JSON.stringify(newDiscussions || discussions));
      localStorage.setItem('communityChatMessages', JSON.stringify(newChatMessages || chatMessages));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      toast.error("Failed to save your data");
    }
  };

  // Handle posting a new discussion
  const handlePostSubmit = () => {
    if (!postContent.trim()) {
      toast.error("Please write something before posting");
      return;
    }
    
    const newDiscussion = {
      id: Date.now(),
      author: "You",
      timeAgo: "Just now",
      content: postContent,
      likes: 0,
      replies: 0,
      tag: selectedTopic === "All Topics" ? "General" : selectedTopic
    };
    
    const updatedDiscussions = [newDiscussion, ...discussions];
    setDiscussions(updatedDiscussions);
    saveToLocalStorage(updatedDiscussions, null);
    
    toast.success("Your post has been submitted");
    setPostContent("");
  };
  
  // Handle sending a chat message
  const handleSendMessage = () => {
    if (!currentMessage.trim()) {
      return;
    }
    
    const newMessage = {
      id: Date.now(),
      room: activeRoom,
      author: "You",
      initials: "You",
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true
    };
    
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    saveToLocalStorage(null, updatedMessages);
    
    setCurrentMessage("");
  };
  
  // Handle liking a discussion
  const handleLikeDiscussion = (id) => {
    const updatedDiscussions = discussions.map(discussion => 
      discussion.id === id 
        ? { ...discussion, likes: discussion.likes + 1 }
        : discussion
    );
    
    setDiscussions(updatedDiscussions);
    saveToLocalStorage(updatedDiscussions, null);
    toast.success("Post liked!");
  };
  
  // Filter discussions by topic
  const filteredDiscussions = selectedTopic === "All Topics" 
    ? discussions 
    : discussions.filter(discussion => discussion.tag === selectedTopic);
  
  // Filter chat messages by active room
  const filteredChatMessages = chatMessages.filter(message => message.room === activeRoom);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="feed" className="w-full animate-fadeIn">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="rooms">Chat Rooms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed" className="mt-0 animate-slideUp">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border/30">
                  <h3 className="font-semibold mb-3">Topics</h3>
                  <p className="text-sm text-muted-foreground mb-4">Browse discussions by topic</p>
                  
                  <div className="space-y-2">
                    {topics.map((topic, i) => (
                      <Button 
                        key={i} 
                        variant={topic === selectedTopic ? "default" : "ghost"} 
                        className={topic === selectedTopic ? "w-full bg-brand hover:bg-brand-600 text-white" : "w-full justify-start"}
                        onClick={() => setSelectedTopic(topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm border border-border/30">
                  <h3 className="font-semibold mb-2">Community Feed</h3>
                  <p className="text-sm text-muted-foreground mb-4">Safe, anonymous discussions about women's health</p>
                  
                  <div className="mb-4">
                    <Textarea 
                      placeholder="Share your thoughts or ask a question..." 
                      className="resize-none min-h-[100px]"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-muted-foreground">Your posts are anonymous by default</p>
                      <Button 
                        className="bg-brand hover:bg-brand-600 text-white"
                        onClick={handlePostSubmit}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Recent Posts</h4>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <FilterIcon className="h-3.5 w-3.5 mr-1" /> Filter
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredDiscussions.length > 0 ? (
                      filteredDiscussions.map((discussion) => (
                        <DiscussionCard
                          key={discussion.id}
                          author={discussion.author}
                          timeAgo={discussion.timeAgo}
                          content={discussion.content}
                          likes={discussion.likes}
                          replies={discussion.replies}
                          tag={discussion.tag}
                          onLike={() => handleLikeDiscussion(discussion.id)}
                        />
                      ))
                    ) : (
                      <div className="text-center p-6 bg-muted/20 rounded-lg">
                        <p className="text-muted-foreground">No discussions found for this topic</p>
                        <Button 
                          className="mt-2 bg-brand hover:bg-brand-600 text-white"
                          onClick={() => setSelectedTopic("All Topics")}
                        >
                          View All Topics
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border/30 mb-6">
                  <h3 className="font-semibold mb-4">Active Discussions</h3>
                  
                  <div className="space-y-3">
                    {activeDiscussions.map((discussion, i) => (
                      <div key={i} className="border-b border-border/30 last:border-0 pb-3 last:pb-0">
                        <a href="#" className="text-brand hover:underline">
                          {discussion.title}
                        </a>
                        <p className="text-xs text-muted-foreground mt-1">
                          {discussion.participants} women discussing
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border/30">
                  <h3 className="font-semibold mb-4">Health Resources</h3>
                  
                  <div className="space-y-3">
                    {resources.map((resource, i) => (
                      <div key={i} className="border-b border-border/30 last:border-0 pb-3 last:pb-0">
                        <a href="#" className="text-brand hover:underline">
                          {resource}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rooms" className="mt-0 animate-slideUp">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border/30">
                  <h3 className="font-semibold mb-4">Active Chat Rooms</h3>
                  
                  <div className="space-y-2">
                    {chatRooms.map((room, i) => (
                      <Button 
                        key={i} 
                        variant={room === activeRoom ? "default" : "ghost"} 
                        className={room === activeRoom ? "w-full bg-brand hover:bg-brand-600 text-white" : "w-full justify-start"}
                        onClick={() => setActiveRoom(room)}
                      >
                        {room}
                      </Button>
                    ))}
                  </div>
                  
                  {/* <div className="mt-4 pt-4 border-t border-border/30">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Feature coming soon!")}
                    >
                      Create New Room
                    </Button>
                  </div> */}
                </div>
              </div>
              
              <div className="md:col-span-9">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border/30 flex flex-col h-[600px]">
                  <div className="p-4 border-b border-border/30">
                    <h3 className="font-semibold">{activeRoom}</h3>
                    <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 30) + 10} participants • {Math.floor(Math.random() * 10) + 1} online</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {filteredChatMessages.length > 0 ? (
                      filteredChatMessages.map((message) => (
                        <div key={message.id} className={`flex items-start gap-3 ${message.isCurrentUser ? 'justify-end' : ''}`}>
                          {!message.isCurrentUser && (
                            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-medium text-brand-600 flex-shrink-0">
                              {message.initials}
                            </div>
                          )}
                          <div className={`${message.isCurrentUser 
                            ? 'bg-brand-50 text-brand-800 dark:bg-brand-900/30 dark:text-brand-100' 
                            : 'bg-muted/40'} rounded-lg p-3 max-w-[80%]`}
                          >
                            {!message.isCurrentUser && (
                              <p className="text-sm font-medium mb-1">{message.author}</p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs ${message.isCurrentUser 
                              ? 'text-brand-600 dark:text-brand-300' 
                              : 'text-muted-foreground'} mt-2`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                          {message.isCurrentUser && (
                            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-xs font-medium text-brand flex-shrink-0">
                              You
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No messages in this room yet. Be the first to say hello!</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-border/30">
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Type your message here..." 
                        className="resize-none"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        className="bg-brand hover:bg-brand-600 text-white self-end"
                        onClick={handleSendMessage}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}