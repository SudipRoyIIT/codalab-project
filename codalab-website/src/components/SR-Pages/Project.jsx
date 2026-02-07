import React, {useState, useEffect} from 'react'

export default function Project() {
    const [items, setItems] = useState({})
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            import.meta.env.VITE_PROJECT_API_URL
          );
          const data = await response.json();
          setItems(data);
          console.log(data)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, []);

  return (
    <div className='w-full'>
            <h3> Ongoing projects </h3>
            <ul>
              {items &&
                items.arrayOfOngoingProjects &&
                items.arrayOfOngoingProjects.map((item, index) => (
                  <li style={{ marginBottom: "10px", width: "59vw" }}>
                    {item.typeOfProject} project ({item.roleInProject}) titled
                    as "{item.projectTitle}" under the Special Call for the
                    Proposals for the Scheduled Tribes sponsored by{" "}
                    {item.sponsors}
                    {item.collaboration !== "" &&
                      `India in collaboration with ${item.collaboration}`}
                    .{item.date}
                  </li>
                ))}
            </ul>

            <h3 className='mt-5'> funded projects</h3>
            <ul style={{ marginLeft: "-1%" }}>
              {items &&
                items.arrayOfFundedProjects &&
                items.arrayOfFundedProjects.map((item, index) => (
                  <li style={{ marginBottom: "10px", width: "59vw" }}>
                    {item.typeOfProject} project ({item.roleInProject}) titled
                    as "{item.projectTitle}" under the Special Call for the
                    Proposals for the Scheduled Tribes sponsored by{" "}
                    {item.sponsors}
                    {item.collaboration !== "" &&
                      `India in collaboration with ${item.collaboration}`}
                    . {item.date}
                  </li>
                ))}
            </ul>
        </div>
  );
}