export interface IJdInfo {
    link: string;
    title: string;
    location: string;
    company: string;
    salary: string;
    description: string;
    infoSource: string;
    postDate: string;
    crawlerCreateDate: string;
}

export interface ICrawlerSetting {
    siteName: string;
    host: string;
    search: ISearchSetting;
    detail: IDetailSetting;
}

export interface IDetailSetting {
    title: string;
    location: string;
    company: string;
    salary: string;
    description: string;
    infoSource: string;
    postDate: string;
}

export interface ISearchSetting {
    url: string;
    linkSelector: string;
    resultPageCountSelector: string;
}